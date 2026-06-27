// Lightweight client-side SQL DDL parser used for the live "detected" preview.
// The production version of this runs in the Next.js API layer (see lib/db.ts).

export type ParseResult = {
  tables: number
  foreignKeys: number
  indexes: number
  triggers: number
  tableNames: string[]
  complexity: "Low" | "Moderate" | "High"
}

export function parseSchema(sql: string): ParseResult {
  const upper = sql.toUpperCase()

  const tableMatches = [...sql.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`]?(\w+)/gi)]
  const tableNames = tableMatches.map((m) => m[1])

  const foreignKeys = (upper.match(/REFERENCES/g) || []).length
  const indexes = (upper.match(/CREATE\s+(?:UNIQUE\s+)?INDEX/g) || []).length
  const triggers = (upper.match(/CREATE\s+TRIGGER/g) || []).length

  const score = tableNames.length * 1 + foreignKeys * 2 + indexes * 1 + triggers * 3
  const complexity = score >= 28 ? "High" : score >= 12 ? "Moderate" : "Low"

  return {
    tables: tableNames.length,
    foreignKeys,
    indexes,
    triggers,
    tableNames,
    complexity,
  }
}
