import "server-only"
import { Pool, type PoolConfig } from "pg"
import { Signer } from "@aws-sdk/rds-signer"

/**
 * Aurora PostgreSQL connection (IAM authentication).
 *
 * This module is the single entry point for backend persistence. It is wired
 * for Amazon Aurora PostgreSQL with IAM auth, but stays dormant until the
 * required environment variables are present, so the app runs on placeholder
 * data during development.
 *
 * Required environment variables:
 *   AURORA_HOST           Cluster endpoint hostname
 *   AURORA_PORT           Defaults to 5432
 *   AURORA_DATABASE       Database name
 *   AURORA_USER           IAM-enabled database user
 *   AWS_REGION            Region of the cluster
 *   AURORA_CA_CERT        (optional) RDS CA bundle for TLS verification
 */

export function isDatabaseConfigured(): boolean {
  return Boolean(
    process.env.AURORA_HOST &&
      process.env.AURORA_DATABASE &&
      process.env.AURORA_USER &&
      process.env.AWS_REGION,
  )
}

let pool: Pool | null = null

async function buildConfig(): Promise<PoolConfig> {
  const host = process.env.AURORA_HOST as string
  const port = Number(process.env.AURORA_PORT ?? 5432)
  const user = process.env.AURORA_USER as string
  const region = process.env.AWS_REGION as string

  // Generate a short-lived IAM auth token instead of a static password.
  const signer = new Signer({ hostname: host, port, username: user, region })
  const token = await signer.getAuthToken()

  return {
    host,
    port,
    user,
    database: process.env.AURORA_DATABASE,
    password: token,
    ssl: process.env.AURORA_CA_CERT
      ? { ca: process.env.AURORA_CA_CERT, rejectUnauthorized: true }
      : { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  }
}

export async function getPool(): Promise<Pool> {
  if (!isDatabaseConfigured()) {
    throw new Error(
      "Aurora PostgreSQL is not configured. Set AURORA_HOST, AURORA_DATABASE, AURORA_USER and AWS_REGION.",
    )
  }
  if (!pool) {
    pool = new Pool(await buildConfig())
  }
  return pool
}

/** Parameterized query helper. Always pass user input through `params`. */
export async function query<T = Record<string, unknown>>(
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
