import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Phases } from "@/components/roadmap/phases"
import { MigrationPreview } from "@/components/roadmap/migration-preview"
import { ArchitectureDiagram } from "@/components/roadmap/architecture-diagram"

export default function RoadmapPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">
                Migration Roadmap
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                checkout-core → Aurora DSQL
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Estimated total: 6–8 weeks across three phases
              </p>
            </div>
            <Button nativeButton={false} render={<Link href="/dashboard" />}>
              Back to analysis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 space-y-6">
            <Phases />
            <div className="grid gap-6 lg:grid-cols-1">
              <ArchitectureDiagram />
              <MigrationPreview />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
