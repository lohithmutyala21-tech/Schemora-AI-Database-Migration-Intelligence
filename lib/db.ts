import "server-only"
import { Pool } from "pg"

let pool: Pool | null = null

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

export async function getPool(): Promise<Pool> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL missing")
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  }

  return pool
}

export async function query<T>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const client = await getPool()
  const result = await client.query(text, params)
  return result.rows as T[]
}

/**
 * Default DATABASE_URL-based pool.
 *
 * This mirrors `lib/db.js` so that `import pool from "@/lib/db.js"` resolves to
 * an identical `pg` Pool for both TypeScript (which resolves the specifier to
 * this file) and the bundler (which resolves it to `lib/db.js` at runtime).
 * Use this for routes that connect with a standard connection string instead of
 * IAM auth.
 */
const defaultPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export default defaultPool
