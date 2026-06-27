import "server-only"
import { isDatabaseConfigured, query } from "@/lib/db"
import { HISTORY, type Project } from "@/lib/data"
import { scoreSchema, type AnalysisResult } from "@/lib/scoring"

/**
 * Repository layer. When Aurora PostgreSQL is configured these functions hit
 * the database; otherwise they fall back to in-memory placeholder data so the
 * UI is fully functional during development.
 */

export async function listProjects(): Promise<Project[]> {
  if (!isDatabaseConfigured()) {
    return HISTORY
  }

  const rows = await query<{
    id: string
    name: string
    created_at: string
    recommendation: Project["recommendation"]
    aurora_fit: number
    status: Project["status"]
  }>(
    `SELECT a.id, p.name, a.created_at, a.recommendation, a.aurora_fit, a.status
       FROM analyses a
       JOIN projects p ON p.id = a.project_id
      ORDER BY a.created_at DESC
      LIMIT 100`,
  )

  return rows.map((r) => ({
    id: `p-${r.id}`,
    project: r.name,
    date: new Date(r.created_at).toISOString().slice(0, 10),
    recommendation: r.recommendation,
    score: r.aurora_fit,
    status: r.status,
  }))
}

export async function createAnalysis(
  name: string,
  sql: string,
): Promise<AnalysisResult & { id: string | null }> {
  const result = scoreSchema(sql)

  if (!isDatabaseConfigured()) {
    return { ...result, id: null }
  }

  const [project] = await query<{ id: string }>(
    `INSERT INTO projects (name) VALUES ($1) RETURNING id`,
    [name],
  )

  const [analysis] = await query<{ id: string }>(
    `INSERT INTO analyses
       (project_id, source_sql, tables, foreign_keys, indexes, triggers,
        complexity, aurora_fit, dynamo_fit, risk_score, recommendation,
        confidence, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'completed')
     RETURNING id`,
    [
      project.id,
      sql,
      result.detected.tables,
      result.detected.foreignKeys,
      result.detected.indexes,
      result.detected.triggers,
      result.complexity,
      result.auroraFit,
      result.dynamoFit,
      result.risk,
      result.recommendation,
      result.confidence,
    ],
  )

  return { ...result, id: `p-${analysis.id}` }
}
