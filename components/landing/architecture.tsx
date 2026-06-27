import { ArrowRight, Cloud, Database, Server } from "lucide-react"

const LAYERS = [
  {
    icon: Cloud,
    title: "Frontend",
    target: "Vercel",
    desc: "Next.js App Router UI delivered on Vercel's edge network.",
  },
  {
    icon: Server,
    title: "Backend",
    target: "Next.js API",
    desc: "Route handlers parse schemas, run scoring, and stream AI reasoning.",
  },
  {
    icon: Database,
    title: "Database",
    target: "Aurora PostgreSQL",
    desc: "Analyses, projects, and scores persisted in Aurora PostgreSQL.",
  },
]

export function Architecture() {
  return (
    <section id="architecture" className="border-b border-border scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Architecture</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Built on a production-grade stack
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            A clean separation of concerns from edge delivery to durable
            relational storage.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
          {LAYERS.map((layer, i) => (
            <div key={layer.title} className="flex flex-1 items-center gap-4">
              <div className="flex-1 rounded-xl border border-border bg-card p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <layer.icon className="h-5 w-5" />
                </span>
                <p className="mt-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {layer.title}
                </p>
                <p className="mt-1 text-lg font-semibold">{layer.target}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {layer.desc}
                </p>
              </div>
              {i < LAYERS.length - 1 && (
                <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
