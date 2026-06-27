import { Database, GitBranch, ShieldCheck } from "lucide-react"

export function SchemaPreviewCard() {
  return (
    <div className="relative">
      <div className="rounded-2xl border border-border bg-card/80 p-2 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-chart-5/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-chart-4/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-chart-3/70" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            checkout-core.sql
          </span>
        </div>

        <div className="rounded-xl border border-border bg-background/60 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Database className="h-4 w-4 text-primary" />
              Schema analysis
            </div>
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
              94% confidence
            </span>
          </div>

          {/* Score bars */}
          <div className="mt-5 space-y-4">
            <ScoreBar label="Aurora DSQL fit" value={88} tone="primary" />
            <ScoreBar label="DynamoDB fit" value={41} tone="muted" />
            <ScoreBar label="Migration complexity" value={62} tone="warn" />
          </div>

          {/* mini relationship graph */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            {["customers", "orders", "order_items", "products", "indexes", "triggers"].map(
              (node, i) => (
                <div
                  key={node}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-2 font-mono text-[11px] text-muted-foreground"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      i % 3 === 0 ? "bg-chart-1" : i % 3 === 1 ? "bg-chart-2" : "bg-chart-3"
                    }`}
                  />
                  {node}
                </div>
              ),
            )}
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 text-xs text-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
            Recommended: Aurora DSQL — relational + transaction-heavy workload
          </div>
        </div>
      </div>

      {/* floating chip */}
      <div className="absolute -left-5 bottom-10 hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-xl sm:flex">
        <GitBranch className="h-4 w-4 text-chart-3" />
        <div className="text-xs">
          <p className="font-medium">4 foreign keys</p>
          <p className="text-muted-foreground">mapped to target</p>
        </div>
      </div>
    </div>
  )
}

function ScoreBar({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: "primary" | "muted" | "warn"
}) {
  const color =
    tone === "primary" ? "bg-primary" : tone === "warn" ? "bg-chart-4" : "bg-muted-foreground"
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
