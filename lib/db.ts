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
