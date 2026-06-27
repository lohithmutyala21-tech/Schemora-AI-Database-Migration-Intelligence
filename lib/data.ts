// Centralized placeholder data + scoring helpers for SchemaShift AI.
// This mirrors the shape the future Aurora PostgreSQL backend will return.

export const SAMPLE_SCHEMA = `-- E-commerce order management schema
CREATE TABLE customers (
  id            BIGSERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  full_name     VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE products (
  id            BIGSERIAL PRIMARY KEY,
  sku           VARCHAR(64) UNIQUE NOT NULL,
  name          VARCHAR(255) NOT NULL,
  price_cents   INTEGER NOT NULL CHECK (price_cents >= 0),
  inventory     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE orders (
  id            BIGSERIAL PRIMARY KEY,
  customer_id   BIGINT NOT NULL REFERENCES customers(id),
  status        VARCHAR(32) NOT NULL DEFAULT 'pending',
  total_cents   INTEGER NOT NULL,
  placed_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE order_items (
  id            BIGSERIAL PRIMARY KEY,
  order_id      BIGINT NOT NULL REFERENCES orders(id),
  product_id    BIGINT NOT NULL REFERENCES products(id),
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  unit_cents    INTEGER NOT NULL
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_items_order ON order_items(order_id);
CREATE INDEX idx_items_product ON order_items(product_id);

CREATE TRIGGER trg_update_inventory
AFTER INSERT ON order_items
FOR EACH ROW EXECUTE FUNCTION decrement_inventory();

CREATE TRIGGER trg_order_total
AFTER INSERT OR UPDATE ON order_items
FOR EACH ROW EXECUTE FUNCTION recompute_order_total();`

export type DetectedSchema = {
  tables: number
  foreignKeys: number
  indexes: number
  triggers: number
  complexity: "Low" | "Moderate" | "High"
}

export const DETECTED: DetectedSchema = {
  tables: 5,
  foreignKeys: 4,
  indexes: 3,
  triggers: 2,
  complexity: "Moderate",
}

export const DETECTED_TABLES = [
  { name: "customers", columns: 4, rows: "1.2M", relations: 1 },
  { name: "products", columns: 5, rows: "48K", relations: 1 },
  { name: "orders", columns: 5, rows: "3.4M", relations: 2 },
  { name: "order_items", columns: 5, rows: "9.1M", relations: 2 },
  { name: "audit_log", columns: 6, rows: "21M", relations: 0 },
]

// Scoring weights — surfaced in the UI to explain the calculation.
export const WEIGHTS = {
  foreignKey: 6,
  trigger: 9,
  complexity: 7,
}

export const SCORES = {
  complexity: 62,
  auroraFit: 88,
  dynamoFit: 41,
  risk: 34,
}

export const RADAR_DATA = [
  { dimension: "Relational Integrity", aurora: 95, dynamo: 35 },
  { dimension: "Transactions", aurora: 92, dynamo: 48 },
  { dimension: "Scale Elasticity", aurora: 74, dynamo: 96 },
  { dimension: "Query Flexibility", aurora: 90, dynamo: 52 },
  { dimension: "Operational Cost", aurora: 68, dynamo: 88 },
  { dimension: "Migration Effort", aurora: 82, dynamo: 44 },
]

export const COMPATIBILITY_MATRIX = [
  { feature: "Foreign Keys", aurora: "full", dynamo: "none" },
  { feature: "ACID Transactions", aurora: "full", dynamo: "partial" },
  { feature: "Secondary Indexes", aurora: "full", dynamo: "partial" },
  { feature: "Triggers", aurora: "full", dynamo: "none" },
  { feature: "Horizontal Scale", aurora: "partial", dynamo: "full" },
  { feature: "Single-digit ms reads", aurora: "partial", dynamo: "full" },
  { feature: "Complex Joins", aurora: "full", dynamo: "none" },
] as const

export const RELATIONSHIP_NODES = [
  { id: "customers", x: 12, y: 20 },
  { id: "orders", x: 50, y: 14 },
  { id: "order_items", x: 50, y: 64 },
  { id: "products", x: 86, y: 64 },
  { id: "audit_log", x: 14, y: 70 },
]

export const RELATIONSHIP_EDGES = [
  { from: "customers", to: "orders" },
  { from: "orders", to: "order_items" },
  { from: "products", to: "order_items" },
]

export const FLAGS = [
  { label: "Relational workload", state: "ok" as const, detail: "Strong foreign-key graph across core tables" },
  { label: "Transaction heavy", state: "ok" as const, detail: "Order writes require multi-row atomicity" },
  { label: "Unsupported patterns", state: "warn" as const, detail: "2 triggers have no DynamoDB equivalent" },
]

export const ROADMAP_PHASES = [
  {
    phase: "Phase 1",
    title: "Schema Refactor",
    duration: "2–3 weeks",
    complexity: "Moderate",
    summary:
      "Normalize trigger logic into application services and document foreign-key constraints for the target engine.",
    tasks: [
      "Extract trigger logic into service layer",
      "Map FK constraints to Aurora DSQL equivalents",
      "Define access patterns and partition strategy",
      "Establish migration test harness",
    ],
  },
  {
    phase: "Phase 2",
    title: "Data Migration",
    duration: "3–4 weeks",
    complexity: "High",
    summary:
      "Stream historical data with change-data-capture, validate row counts, and reconcile referential integrity.",
    tasks: [
      "Provision target cluster and IAM roles",
      "Backfill with CDC dual-write window",
      "Checksum reconciliation per table",
      "Cut read traffic to shadow cluster",
    ],
  },
  {
    phase: "Phase 3",
    title: "Cutover",
    duration: "1 week",
    complexity: "Moderate",
    summary:
      "Freeze writes, perform final delta sync, flip the connection string, and monitor latency and error budgets.",
    tasks: [
      "Final delta synchronization",
      "Flip application connection string",
      "Monitor p99 latency + error rate",
      "Decommission legacy instance",
    ],
  },
]

export type Project = {
  id: string
  project: string
  date: string
  recommendation: "Aurora DSQL" | "DynamoDB" | "Hybrid"
  score: number
  status: "Completed" | "In Review" | "Migrating" | "Draft"
}

export const HISTORY: Project[] = [
  { id: "p-1042", project: "checkout-core", date: "2026-06-21", recommendation: "Aurora DSQL", score: 88, status: "Migrating" },
  { id: "p-1041", project: "session-store", date: "2026-06-18", recommendation: "DynamoDB", score: 93, status: "Completed" },
  { id: "p-1039", project: "billing-ledger", date: "2026-06-11", recommendation: "Aurora DSQL", score: 91, status: "Completed" },
  { id: "p-1036", project: "event-pipeline", date: "2026-06-04", recommendation: "DynamoDB", score: 84, status: "In Review" },
  { id: "p-1033", project: "catalog-service", date: "2026-05-28", recommendation: "Hybrid", score: 72, status: "Completed" },
  { id: "p-1029", project: "notification-hub", date: "2026-05-19", recommendation: "DynamoDB", score: 89, status: "Completed" },
  { id: "p-1024", project: "inventory-sync", date: "2026-05-09", recommendation: "Aurora DSQL", score: 79, status: "Draft" },
]

export const STATS = [
  { value: "2,847", label: "Schemas Analysed" },
  { value: "94%", label: "Recommendation Confidence" },
  { value: "$2.1M", label: "Estimated Migration Savings" },
]
