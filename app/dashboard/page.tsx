import Link from "next/link"
import { Download, FileCode2 } from "lucide-react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ScoreCards } from "@/components/dashboard/score-cards"
import { RadarComparison } from "@/components/dashboard/radar-comparison"
import { RelationshipGraph } from "@/components/dashboard/relationship-graph"
import { CompatibilityMatrix } from "@/components/dashboard/compatibility-matrix"
import { AiRecommendation } from "@/components/dashboard/ai-recommendation"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">
                Analysis Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                checkout-core
              </h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <FileCode2 className="h-4 w-4" />
                checkout-core.sql · analysed 2026-06-27
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/upload" />}
              >
                Re-analyse
              </Button>
              <Button>
                <Download className="h-4 w-4" />
                Export report
              </Button>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <ScoreCards />
            <AiRecommendation />
            <div className="grid gap-6 lg:grid-cols-2">
              <RadarComparison />
              <RelationshipGraph />
            </div>
            <CompatibilityMatrix />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
