import { RELATIONSHIP_NODES, RELATIONSHIP_EDGES } from "@/lib/data"

export function RelationshipGraph() {
  const nodeById = Object.fromEntries(
    RELATIONSHIP_NODES.map((n) => [n.id, n]),
  )

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold">Schema relationships</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Foreign-key graph across detected tables.
      </p>

      <div className="relative mt-4 h-[320px] w-full overflow-hidden rounded-lg border border-border bg-background/50">
        <svg
          className="absolute inset-0 h-full w-full"
          aria-hidden
          preserveAspectRatio="none"
        >
          {RELATIONSHIP_EDGES.map((edge) => {
            const from = nodeById[edge.from]
            const to = nodeById[edge.to]
            if (!from || !to) return null
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke="var(--color-primary)"
                strokeOpacity={0.4}
                strokeWidth={1.5}
              />
            )
          })}
        </svg>

        {RELATIONSHIP_NODES.map((node) => (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 font-mono text-[11px] shadow-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {node.id}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">3 relationships</span>{" "}
        detected · 1 isolated table (audit_log)
      </p>
    </div>
  )
}
