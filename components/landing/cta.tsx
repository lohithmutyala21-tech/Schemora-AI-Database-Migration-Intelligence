import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-8 py-14 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_0%,oklch(0.62_0.19_253/0.2),transparent_70%)]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Stop guessing where your data should live
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
              Upload a schema and get a structured, defensible migration
              recommendation in minutes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/upload" />}
              >
                Analyse Your Schema
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link href="/history" />}
              >
                Browse Past Analyses
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
