import { Code2, Gauge, Map, Network } from "lucide-react"

const FEATURES = [
  {
    icon: Code2,
    title: "Schema Parser",
    desc: "Parse raw SQL into a structured model — tables, foreign keys, indexes, triggers, and constraints detected automatically.",
  },
  {
    icon: Gauge,
    title: "Compatibility Scorer",
    desc: "Weighted scoring quantifies fit for Aurora DSQL and DynamoDB so you can compare engines on the same axis.",
  },
  {
    icon: Map,
    title: "Migration Roadmap",
    desc: "A phased plan with estimated duration, complexity, and previews for refactor, data migration, and cutover.",
  },
  {
    icon: Network,
    title: "Architecture Overview",
    desc: "Visualize relationships and target topology before you write a single migration script.",
  },
]

export function Features() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Capabilities</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Everything you need to make the migration call
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            From raw DDL to a defensible recommendation, Schemora turns schema
            complexity into clear, structured intelligence.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
