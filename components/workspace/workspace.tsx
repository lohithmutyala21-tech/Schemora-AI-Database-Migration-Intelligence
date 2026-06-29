"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  FileCode2,
  FileUp,
  Loader2,
  Play,
  Sparkles,
  Table2,
  GitBranch,
  ListTree,
  Zap,
  Gauge,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SqlEditor } from "@/components/workspace/sql-editor"
import { SAMPLE_SCHEMA } from "@/lib/data"
import { parseSchema } from "@/lib/parse"

export function Workspace() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [sql, setSql] = useState(SAMPLE_SCHEMA)
  const [analysing, setAnalysing] = useState(false)

  const detected = useMemo(() => parseSchema(sql), [sql])

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setSql(String(reader.result))
    reader.readAsText(file)
  }

  async function analyse() {
  setAnalysing(true)
  try {
    const res = await fetch("/api/analyse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql, projectName: "My Project" }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Analysis failed")
    localStorage.setItem("schemora_result", JSON.stringify(data))
    router.push("/dashboard")
  } catch (e) {
    console.error(e)
    router.push("/dashboard")
  } finally {
    setAnalysing(false)
  }
}

  const stats = [
    { icon: Table2, label: "Tables detected", value: detected.tables },
    { icon: GitBranch, label: "Foreign keys", value: detected.foreignKeys },
    { icon: ListTree, label: "Indexes", value: detected.indexes },
    { icon: Zap, label: "Triggers", value: detected.triggers },
  ]

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          Upload Workspace
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Bring your SQL schema
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Paste DDL, upload a .sql file, or load the sample. Schemora parses
          structure in real time before running the full analysis.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Editor column */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileCode2 className="h-4 w-4 text-primary" />
              schema.sql
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileRef}
                type="file"
                accept=".sql,.txt"
                onChange={handleFile}
                className="hidden"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileRef.current?.click()}
              >
                <FileUp className="h-4 w-4" />
                Upload .sql
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSql(SAMPLE_SCHEMA)}
              >
                Sample schema
              </Button>
            </div>
          </div>

          <SqlEditor value={sql} onChange={setSql} />

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {sql.length.toLocaleString()} characters ·{" "}
              {sql.split("\n").length} lines
            </p>
            <Button onClick={analyse} disabled={analysing || detected.tables === 0}>
              {analysing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analysing…
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Analyse schema
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Detected preview column */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Detected preview</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Live structural parse of your DDL.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-border bg-background/50 p-3"
                >
                  <s.icon className="h-4 w-4 text-primary" />
                  <p className="mt-2 font-mono text-2xl font-semibold">
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-background/50 p-3">
              <div className="flex items-center gap-2 text-sm">
                <Gauge className="h-4 w-4 text-primary" />
                Estimated complexity
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  detected.complexity === "High"
                    ? "bg-chart-5/15 text-chart-5"
                    : detected.complexity === "Moderate"
                      ? "bg-chart-4/15 text-chart-4"
                      : "bg-chart-3/15 text-chart-3"
                }`}
              >
                {detected.complexity}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Detected tables</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {detected.tableNames.length === 0 && (
                <li className="text-xs text-muted-foreground">
                  No tables detected yet.
                </li>
              )}
              {detected.tableNames.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-2 rounded-md border border-border bg-background/50 px-3 py-2 font-mono text-xs"
                >
                  <Table2 className="h-3.5 w-3.5 text-primary" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
