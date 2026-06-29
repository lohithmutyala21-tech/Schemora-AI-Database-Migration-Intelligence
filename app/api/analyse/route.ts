import { NextResponse } from "next/server"
import { Parser } from "node-sql-parser"
import pool from "@/lib/db.js"

type Counts = {
  table_count: number
  foreign_key_count: number
  index_count: number
  trigger_count: number
}

// Count structural elements from SQL. node-sql-parser handles the well-formed
// statements; regex fallbacks cover Postgres DDL the parser does not model
// (notably CREATE TRIGGER and inline REFERENCES constraints).
function countSchemaElements(sql: string): Counts {
  let tableCount = 0
  let foreignKeyCount = 0
  let indexCount = 0

  try {
    const parser = new Parser()
    const ast = parser.astify(sql, { database: "postgresql" })
    const statements = Array.isArray(ast) ? ast : [ast]

    for (const stmt of statements as any[]) {
      if (stmt?.type !== "create") continue

      if (stmt.keyword === "table") {
        tableCount += 1
        const defs: any[] = stmt.create_definitions ?? []
        for (const def of defs) {
          if (
            def?.constraint_type === "FOREIGN KEY" ||
            def?.reference_definition ||
            def?.reference
          ) {
            foreignKeyCount += 1
          }
        }
      } else if (stmt.keyword === "index") {
        indexCount += 1
      }
    }
  } catch (error) {
    console.log("[v0] node-sql-parser failed, using regex fallback:", (error as Error).message)
  }

  // Regex fallbacks / supplements. Use these when the parser found nothing or
  // for elements it does not represent.
  const tableMatches = sql.match(/CREATE\s+TABLE/gi)?.length ?? 0
  const indexMatches = sql.match(/CREATE\s+(?:UNIQUE\s+)?INDEX/gi)?.length ?? 0
  const fkMatches =
    (sql.match(/FOREIGN\s+KEY/gi)?.length ?? 0) +
    (sql.match(/\bREFERENCES\b/gi)?.length ?? 0)
  const triggerCount = sql.match(/CREATE\s+(?:OR\s+REPLACE\s+)?TRIGGER/gi)?.length ?? 0

  return {
    table_count: Math.max(tableCount, tableMatches),
    foreign_key_count: Math.max(foreignKeyCount, fkMatches),
    index_count: Math.max(indexCount, indexMatches),
    trigger_count: triggerCount,
  }
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

// Human-readable explanation of why a database was recommended.
function buildReasoning(params: {
  counts: Counts
  recommendation: string
  dsqlFit: number
  dynamoFit: number
}): string {
  const { counts, recommendation, dsqlFit, dynamoFit } = params
  const { table_count, foreign_key_count, trigger_count } = counts
  const coupling =
    foreign_key_count >= 4
      ? "highly relational"
      : foreign_key_count > 0
        ? "moderately relational"
        : "loosely coupled"

  if (recommendation === "Aurora DSQL") {
    const triggerNote =
      trigger_count > 0
        ? ` plus ${trigger_count} trigger${trigger_count === 1 ? "" : "s"} that require server-side logic`
        : ""
    return `This schema is a ${coupling}, ${trigger_count > 0 ? "transaction-heavy" : "structured"} workload spanning ${table_count} table${table_count === 1 ? "" : "s"} with ${foreign_key_count} foreign key${foreign_key_count === 1 ? "" : "s"}${triggerNote}. Aurora DSQL scored ${dsqlFit}% versus DynamoDB's ${dynamoFit}% because its relational integrity and distributed SQL transaction guarantees preserve the foreign-key graph and atomic multi-row writes that a key-value model cannot express natively.`
  }

  return `This schema is ${coupling} with ${table_count} table${table_count === 1 ? "" : "s"} and only ${foreign_key_count} foreign key${foreign_key_count === 1 ? "" : "s"}, making its access patterns a strong fit for a key-value model. DynamoDB scored ${dynamoFit}% versus Aurora DSQL's ${dsqlFit}% thanks to single-digit-millisecond reads and elastic horizontal scale, with minimal relational coupling to migrate.`
}

export async function POST(request: Request) {
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    )
  }

  const sql: unknown = body?.sql
  const projectName: unknown = body?.projectName

  if (typeof sql !== "string" || sql.trim().length === 0) {
    return NextResponse.json(
      { error: "A non-empty `sql` string is required." },
      { status: 400 },
    )
  }
  if (typeof projectName !== "string" || projectName.trim().length === 0) {
    return NextResponse.json(
      { error: "A non-empty `projectName` string is required." },
      { status: 400 },
    )
  }

  const counts = countSchemaElements(sql)
  const { table_count, foreign_key_count, index_count, trigger_count } = counts

  // Deterministic scoring.
  const complexity = clamp(
    (foreign_key_count * 0.3 +
      trigger_count * 0.3 +
      table_count * 0.2 +
      index_count * 0.2) *
      10,
  )
  const dsql_fit = clamp(100 - (foreign_key_count * 8 + trigger_count * 12))
  const dynamodb_fit = clamp(100 - (table_count * 5 + index_count * 3))
  const risk_score = clamp(foreign_key_count * 5 + trigger_count * 8)
  const recommendation = dsql_fit > dynamodb_fit ? "Aurora DSQL" : "DynamoDB"
  const confidence = clamp(Math.abs(dsql_fit - dynamodb_fit))

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const projectResult = await client.query(
      `INSERT INTO projects (name) VALUES ($1) RETURNING id`,
      [projectName.trim()],
    )
    const projectId = projectResult.rows[0].id

    const schemaResult = await client.query(
      `INSERT INTO schemas (project_id, raw_sql) VALUES ($1, $2) RETURNING id`,
      [projectId, sql],
    )
    const schemaId = schemaResult.rows[0].id

    await client.query(
      `INSERT INTO parsed_metadata
         (schema_id, table_count, foreign_key_count, index_count, trigger_count)
       VALUES ($1, $2, $3, $4, $5)`,
      [schemaId, table_count, foreign_key_count, index_count, trigger_count],
    )

    const analysisResult = await client.query(
      `INSERT INTO analyses
         (project_id, schema_id, source_sql, tables, foreign_keys, indexes,
          triggers, complexity, aurora_fit, dynamo_fit, risk_score,
          recommendation, confidence)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING id, created_at`,
      [
        projectId,
        schemaId,
        sql,
        table_count,
        foreign_key_count,
        index_count,
        trigger_count,
        complexity,
        dsql_fit,
        dynamodb_fit,
        risk_score,
        recommendation,
        confidence,
      ],
    )

    await client.query("COMMIT")

    return NextResponse.json(
      {
        id: analysisResult.rows[0].id,
        projectId,
        schemaId,
        projectName: projectName.trim(),
        metadata: {
          table_count,
          foreign_key_count,
          index_count,
          trigger_count,
        },
        scores: {
          complexity,
          dsql_fit,
          dynamodb_fit,
          risk_score,
          confidence,
        },
        recommendation,
        createdAt: analysisResult.rows[0].created_at,
      },
      { status: 201 },
    )
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {})
    console.log("[v0] analyse route DB error:", (error as Error).message)
    return NextResponse.json(
      { error: "Failed to analyse and persist schema." },
      { status: 500 },
    )
  } finally {
    client.release()
  }
}
