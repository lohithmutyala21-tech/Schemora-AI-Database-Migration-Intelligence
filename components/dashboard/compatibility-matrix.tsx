import { Check, Minus, X } from "lucide-react"
import { COMPATIBILITY_MATRIX } from "@/lib/data"

function Support({ level }: { level: "full" | "partial" | "none" }) {
  if (level === "full")
    return (
      <span className="inline-flex items-center gap-1.5 text-chart-3">
        <Check className="h-3.5 w-3.5" /> Full
      </span>
    )
  if (level === "partial")
    return (
      <span className="inline-flex items-center gap-1.5 text-chart-4">
        <Minus className="h-3.5 w-3.5" /> Partial
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <X className="h-3.5 w-3.5" /> None
    </span>
  )
}

export function CompatibilityMatrix() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold">Compatibility matrix</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Feature-level support across target engines.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="pb-2 font-medium">Feature</th>
              <th className="pb-2 font-medium">Aurora DSQL</th>
              <th className="pb-2 font-medium">DynamoDB</th>
            </tr>
          </thead>
          <tbody>
            {COMPATIBILITY_MATRIX.map((row) => (
              <tr
                key={row.feature}
                className="border-b border-border/60 last:border-0"
              >
                <td className="py-2.5 text-foreground">{row.feature}</td>
                <td className="py-2.5">
                  <Support level={row.aurora} />
                </td>
                <td className="py-2.5">
                  <Support level={row.dynamo} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
