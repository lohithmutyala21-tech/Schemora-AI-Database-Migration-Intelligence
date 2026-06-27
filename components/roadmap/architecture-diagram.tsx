import { ArrowRight, Database, GitCompareArrows, HardDrive } from "lucide-react"

const STAGES = [
  {
    icon: HardDrive,
    title: "Source",
    sub: "PostgreSQL primary",
    note: "Live production traffic",
  },
  {
    icon: GitCompareArrows,
    title: "CDC dual-write",
    sub: "Change data capture",
    note: "Backfill + delta sync",
  },
  {
    icon: Database,
    title: "Target",
    sub: "Aurora DSQL cluster",
    note: "Shadow then primary",
  },
]

export function ArchitectureDiagram() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold">Target architecture</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Zero-downtime cutover topology with change data capture.
      </p>

      <div className="mt-5 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
        {STAGES.map((stage, i) => (
          <div key={stage.title} className="flex flex-1 items-center gap-3">
            <div className="flex-1 rounded-lg border border-border bg-background/60 p-4 text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stage.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-semibold">{stage.title}</p>
              <p className="text-xs text-muted-foreground">{stage.sub}</p>
              <p className="mt-2 font-mono text-[11px] text-primary">
                {stage.note}
              </p>
            </div>
            {i < STAGES.length - 1 && (
              <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground lg:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
