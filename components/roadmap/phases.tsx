import { CheckCircle2, Clock, Gauge } from "lucide-react"
import { ROADMAP_PHASES } from "@/lib/data"

const complexityTone: Record<string, string> = {
  Low: "bg-chart-3/15 text-chart-3",
  Moderate: "bg-chart-4/15 text-chart-4",
  High: "bg-chart-5/15 text-chart-5",
}

export function Phases() {
  return (
    <div className="relative">
      {/* vertical connector */}
      <div className="absolute left-[15px] top-2 bottom-2 hidden w-px bg-border sm:block" />

      <div className="space-y-5">
        {ROADMAP_PHASES.map((phase, i) => (
          <div key={phase.phase} className="relative sm:pl-12">
            <span className="absolute left-0 top-1 hidden h-8 w-8 items-center justify-center rounded-full border border-border bg-card font-mono text-xs font-semibold text-primary sm:flex">
              {i + 1}
            </span>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {phase.phase}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold">{phase.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {phase.duration}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${complexityTone[phase.complexity]}`}
                  >
                    <Gauge className="h-3.5 w-3.5" />
                    {phase.complexity}
                  </span>
                </div>
              </div>

              <p className="mt-4 leading-relaxed text-muted-foreground">
                {phase.summary}
              </p>

              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {phase.tasks.map((task) => (
                  <li
                    key={task}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
