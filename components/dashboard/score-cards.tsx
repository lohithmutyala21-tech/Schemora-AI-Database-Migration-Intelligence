import { Activity, AlertTriangle, Database, Layers } from "lucide-react"
import { SCORES, WEIGHTS, DETECTED } from "@/lib/data"

const CARDS = [
  {
    key: "complexity",
    icon: Layers,
    label: "Migration Complexity",
    value: SCORES.complexity,
    suffix: "/100",
    tone: "warn" as const,
    formula: `(FK ${DETECTED.foreignKeys}×${WEIGHTS.foreignKey}) + (Trig ${DETECTED.triggers}×${WEIGHTS.trigger}) + (Cmplx ×${WEIGHTS.complexity})`,
  },
  {
    key: "aurora",
    icon: Database,
    label: "Aurora DSQL Fit",
    value: SCORES.auroraFit,
    suffix: "%",
    tone: "good" as const,
    formula: "Relational integrity + transaction weight + join depth",
  },
  {
    key: "dynamo",
    icon: Activity,
    label: "DynamoDB Fit",
    value: SCORES.dynamoFit,
    suffix: "%",
    tone: "muted" as const,
    formula: "Access-pattern locality − relational coupling penalty",
  },
  {
    key: "risk",
    icon: AlertTriangle,
    label: "Risk Score",
    value: SCORES.risk,
    suffix: "/100",
    tone: "good" as const,
    formula: "Unsupported patterns × severity + data-volume factor",
  },
]

const toneStyles = {
  good: "text-chart-3",
  warn: "text-chart-4",
  muted: "text-muted-foreground",
}
const barStyles = {
  good: "bg-chart-3",
  warn: "bg-chart-4",
  muted: "bg-muted-foreground",
}

export function ScoreCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{card.label}</span>
            <card.icon className={`h-4 w-4 ${toneStyles[card.tone]}`} />
          </div>
          <p className="mt-3 font-mono text-3xl font-semibold">
            {card.value}
            <span className="text-lg text-muted-foreground">{card.suffix}</span>
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full ${barStyles[card.tone]}`}
              style={{ width: `${card.value}%` }}
            />
          </div>
          <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {card.formula}
          </p>
        </div>
      ))}
    </div>
  )
}
