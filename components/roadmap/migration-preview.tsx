import { ArrowRight } from "lucide-react"

const BEFORE = `CREATE TABLE orders (
  id          BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id),
  status      VARCHAR(32),
  total_cents INTEGER
);

CREATE TRIGGER trg_order_total
AFTER INSERT ON order_items ...`

const AFTER = `-- Aurora DSQL (PostgreSQL compatible)
CREATE TABLE orders (
  id          BIGINT GENERATED ALWAYS AS IDENTITY,
  customer_id BIGINT NOT NULL,
  status      TEXT,
  total_cents INTEGER,
  PRIMARY KEY (id)
);
-- trigger logic moved to service layer`

export function MigrationPreview() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold">Migration preview</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Example transformation for the{" "}
        <span className="font-mono">orders</span> table.
      </p>

      <div className="mt-4 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <CodePanel label="Source · PostgreSQL" code={BEFORE} tone="muted" />
        <ArrowRight className="mx-auto hidden h-5 w-5 text-muted-foreground lg:block" />
        <CodePanel label="Target · Aurora DSQL" code={AFTER} tone="primary" />
      </div>
    </div>
  )
}

function CodePanel({
  label,
  code,
  tone,
}: {
  label: string
  code: string
  tone: "muted" | "primary"
}) {
  return (
    <div
      className={`overflow-hidden rounded-lg border ${
        tone === "primary" ? "border-primary/30" : "border-border"
      } bg-background/60`}
    >
      <div className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
        {label}
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-5 text-foreground">
        {code}
      </pre>
    </div>
  )
}
