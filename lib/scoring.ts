import { WEIGHTS } from "@/lib/data"
import { parseSchema, type ParseResult } from "@/lib/parse"

export type AnalysisResult = {
  detected: ParseResult
  complexity: number
  auroraFit: number
  dynamoFit: number
  risk: number
  recommendation: "Aurora DSQL" | "DynamoDB" | "Hybrid"
  confidence: number
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

/**
 * Deterministic scoring engine. The same weights are surfaced in the dashboard
 * UI so the calculation stays explainable:
 *   complexity = FK×6 + Trigger×9 + relativeComplexity×7
 */
export function scoreSchema(sql: string): AnalysisResult {
  const detected = parseSchema(sql)

  const complexityBase =
    detected.foreignKeys * WEIGHTS.foreignKey +
    detected.triggers * WEIGHTS.trigger +
    (detected.complexity === "High" ? 5 : detected.complexity === "Moderate" ? 3 : 1) *
      WEIGHTS.complexity
  const complexity = clamp(complexityBase)

  // Relational coupling favours Aurora; access-pattern locality favours DynamoDB.
  const relationalSignal =
    detected.foreignKeys * 14 + detected.triggers * 10 + detected.tables * 4
  const auroraFit = clamp(45 + relationalSignal)
  const dynamoFit = clamp(95 - relationalSignal * 0.8)

  const risk = clamp(detected.triggers * 12 + detected.foreignKeys * 3)

  const recommendation: AnalysisResult["recommendation"] =
    auroraFit - dynamoFit > 20
      ? "Aurora DSQL"
      : dynamoFit - auroraFit > 20
        ? "DynamoDB"
        : "Hybrid"

  const confidence = clamp(60 + Math.abs(auroraFit - dynamoFit) / 2)

  return {
    detected,
    complexity,
    auroraFit,
    dynamoFit,
    risk,
    recommendation,
    confidence,
  }
}
