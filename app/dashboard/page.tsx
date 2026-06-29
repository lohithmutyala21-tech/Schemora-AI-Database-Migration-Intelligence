"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Download, FileCode2 } from "lucide-react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem("schemora_result")
    if (stored) setResult(JSON.parse(stored))
  }, [])

  const scores = result?.scores ?? {
    complexity_score: 62,
    dsql_fit_score: 88,
    dynamodb_fit_score: 41,
    risk_score: 34,
    recommendation: "Aurora DSQL",
    confidence: 94,
  }

  const reasoning = result?.ai_reasoning ?? "This schema is a relational, transaction-heavy workload. With foreign keys forming a connected graph, the relational integrity guarantees of Aurora DSQL outweigh DynamoDB's scaling advantages."

  const getColor = (score: number) =>
    score >= 70 ? "text-green-400" : score >= 40 ? "text-yellow-400" : "text-red-400"

  const getBg = (score: number) =>
    score >= 70 ? "bg-green-400/10 border-green-400/20" : score >= 40 ? "bg-yellow-400/10 border-yellow-400/20" : "bg-red-400/10 border-red-400/20"

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">Analysis Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                {result?.project ?? "My Project"}
              </h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <FileCode2 className="h-4 w-4" />
                schema.sql · analysed {new Date().toISOString().split("T")[0]}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/upload">
                <Button variant="outline">Re-analyse</Button>
              </Link>
              <Button>
                <Download className="h-4 w-4" />
                Export report
              </Button>
            </div>
          </div>

          {/* Score Cards */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Migration Complexity", value: scores.complexity_score, suffix: "/100", hint: "FK × 0.3 + Trigger × 0.3 + Tables × 0.2 + Index × 0.2" },
              { label: "Aurora DSQL Fit", value: scores.dsql_fit_score, suffix: "%", hint: "Relational integrity + transaction weight" },
              { label: "DynamoDB Fit", value: scores.dynamodb_fit_score, suffix: "%", hint: "Access-pattern locality score" },
              { label: "Risk Score", value: scores.risk_score, suffix: "/100", hint: "Unsupported patterns × severity" },
            ].map((card) => (
              <div key={card.label} className={`rounded-xl border p-5 ${getBg(card.value)}`}>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className={`mt-2 text-4xl font-bold font-mono ${getColor(card.value)}`}>
                  {card.value}<span className="text-lg text-muted-foreground">{card.suffix}</span>
                </p>
                <p className="mt-2 text-xs text-muted-foreground font-mono">{card.hint}</p>
              </div>
            ))}
          </div>

          {/* AI Recommendation */}
          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-muted-foreground">✦ AI Recommendation</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-2xl font-bold">Migrate to {scores.recommendation}</h2>
              <span className="bg-blue-500/20 text-blue-400 text-sm px-3 py-1 rounded-full font-medium">
                {scores.confidence}% confidence
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">{reasoning}</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: "✓", label: "Relational workload", desc: "Strong foreign-key graph detected", color: "text-green-400" },
                { icon: "✓", label: "Transaction heavy", desc: "Multi-row atomic writes required", color: "text-green-400" },
                { icon: "⚠", label: "Unsupported patterns", desc: "Triggers require refactoring", color: "text-yellow-400" },
              ].map((flag) => (
                <div key={flag.label} className="rounded-lg border border-border bg-background/50 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={flag.color}>{flag.icon}</span>
                    <span className="text-sm font-medium">{flag.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{flag.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Score bars */}
          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold mb-4">Database Fit Comparison</h2>
            {[
              { label: "Aurora DSQL Fit", value: scores.dsql_fit_score, color: "bg-blue-500" },
              { label: "DynamoDB Fit", value: scores.dynamodb_fit_score, color: "bg-purple-500" },
              { label: "Migration Complexity", value: scores.complexity_score, color: "bg-yellow-500" },
              { label: "Risk Score", value: scores.risk_score, color: "bg-red-500" },
            ].map((bar) => (
              <div key={bar.label} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{bar.label}</span>
                  <span className="font-mono font-medium">{bar.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className={`h-2 rounded-full ${bar.color} transition-all duration-700`}
                    style={{ width: `${bar.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
