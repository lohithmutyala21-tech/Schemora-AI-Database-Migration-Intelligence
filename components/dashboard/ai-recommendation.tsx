import Link from "next/link"
import { ArrowRight, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FLAGS } from "@/lib/data"

export function AiRecommendation() {
  return (
    <div className="rounded-xl border border-primary/30 bg-card p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Sparkles className="h-4 w-4" />
        AI Recommendation
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          Migrate to Aurora DSQL
        </h2>
        <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
          94% confidence
        </span>
      </div>

      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
        This schema is a{" "}
        <span className="text-foreground">relational, transaction-heavy</span>{" "}
        workload. With 4 foreign keys forming a connected graph across{" "}
        <span className="font-mono text-foreground">orders</span>,{" "}
        <span className="font-mono text-foreground">order_items</span>, and{" "}
        <span className="font-mono text-foreground">customers</span>, plus
        multi-row atomic writes, the relational integrity guarantees of Aurora
        DSQL outweigh DynamoDB&apos;s scaling advantages. DynamoDB scored 41%
        primarily due to the join depth and trigger logic that lack a native
        key-value equivalent.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {FLAGS.map((flag) => (
          <div
            key={flag.label}
            className="rounded-lg border border-border bg-background/50 p-4"
          >
            <div className="flex items-center gap-2">
              {flag.state === "ok" ? (
                <CheckCircle2 className="h-4 w-4 text-chart-3" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-chart-4" />
              )}
              <span className="text-sm font-medium">{flag.label}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {flag.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button nativeButton={false} render={<Link href="/roadmap" />}>
          View migration roadmap
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
