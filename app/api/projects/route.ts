import { NextResponse } from "next/server"
import { listProjects } from "@/lib/analyses"

export async function GET() {
  try {
    const projects = await listProjects()
    return NextResponse.json({ projects })
  } catch (error) {
    console.log("[v0] projects route error:", (error as Error).message)
    return NextResponse.json(
      { error: "Failed to load projects." },
      { status: 500 },
    )
  }
}
