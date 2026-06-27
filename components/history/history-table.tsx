import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { HISTORY, type Project } from "@/lib/data"

const recTone: Record<Project["recommendation"], string> = {
  "Aurora DSQL": "bg-chart-1/15 text-chart-1",
  DynamoDB: "bg-chart-4/15 text-chart-4",
  Hybrid: "bg-chart-2/15 text-chart-2",
}

const statusTone: Record<Project["status"], string> = {
  Completed: "bg-chart-3/15 text-chart-3",
  Migrating: "bg-primary/15 text-primary",
  "In Review": "bg-chart-4/15 text-chart-4",
  Draft: "bg-secondary text-muted-foreground",
}

export function HistoryTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Project</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Recommendation</th>
              <th className="px-5 py-3 font-medium">Score</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium sr-only">View</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-foreground">{row.project}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {row.id}
                  </p>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                  {row.date}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${recTone[row.recommendation]}`}
                  >
                    {row.recommendation}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">{row.score}</span>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${row.score}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusTone[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    View
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
