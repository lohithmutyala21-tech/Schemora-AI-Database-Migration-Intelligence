import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SchemaPreviewCard } from "@/components/landing/schema-preview-card"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.62_0.19_253/0.18),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,oklch(1_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col items-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered migration intelligence
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Know exactly where your database belongs
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Upload your SQL schema and receive structured migration intelligence
            powered by schema parsing, compatibility scoring, and AI reasoning.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
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
              render={<Link href="/dashboard" />}
            >
              View Sample Report
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex -space-x-1.5">
              <span className="h-5 w-5 rounded-full border border-background bg-chart-1" />
              <span className="h-5 w-5 rounded-full border border-background bg-chart-2" />
              <span className="h-5 w-5 rounded-full border border-background bg-chart-3" />
            </span>
            Trusted by engineering teams migrating petabyte-scale workloads
          </div>
        </div>

        <SchemaPreviewCard />
      </div>
    </section>
  )
}
