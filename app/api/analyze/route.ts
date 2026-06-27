import { NextResponse } from "next/server"
import { createAnalysis } from "@/lib/analyses"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const sql: unknown = body?.sql
    const name: unknown = body?.name

    if (typeof sql !== "string" || sql.trim().length === 0) {
      return NextResponse.json(
        { error: "A non-empty `sql` string is required." },
        { status: 400 },
      )
    }

    const projectName =
      typeof name === "string" && name.trim() ? name.trim() : "untitled-schema"

    const analysis = await createAnalysis(projectName, sql)
    return NextResponse.json(analysis, { status: 201 })
  } catch (error) {
    console.log("[v0] analyze route error:", (error as Error).message)
    return NextResponse.json(
      { error: "Failed to analyse schema." },
      { status: 500 },
    )
  }
}
