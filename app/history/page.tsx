import Link from "next/link"
import { Plus } from "lucide-react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { HistoryTable } from "@/components/history/history-table"
import { Architecture } from "@/components/landing/architecture"
import { HISTORY } from "@/lib/data"

export default function HistoryPage() {
  const completed = HISTORY.filter((h) => h.status === "Completed").length
  const avgScore = Math.round(
    HISTORY.reduce((sum, h) => sum + h.score, 0) / HISTORY.length,
  )

  const summary = [
    { label: "Total analyses", value: HISTORY.length },
    { label: "Completed migrations", value: completed },
    { label: "Average score", value: avgScore },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">Project History</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Past analyses
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Every schema analysed by your team, with its recommendation and
                status.
              </p>
            </div>
            <Button nativeButton={false} render={<Link href="/upload" />}>
              <Plus className="h-4 w-4" />
              New analysis
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {summary.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-card p-5"
              >
                <p className="font-mono text-3xl font-semibold">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <HistoryTable />
          </div>
        </div>

        <Architecture />
      </main>
      <SiteFooter />
    </div>
  )
}
