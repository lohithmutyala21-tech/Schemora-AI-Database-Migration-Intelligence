"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { RADAR_DATA } from "@/lib/data"

export function RadarComparison() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold">Engine comparison</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Aurora DSQL vs DynamoDB across six migration dimensions.
      </p>
      <div className="mt-2 h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={RADAR_DATA} outerRadius="72%">
            <PolarGrid stroke="oklch(1 0 0 / 0.1)" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: "oklch(0.68 0.02 255)", fontSize: 11 }}
            />
            <Radar
              name="Aurora DSQL"
              dataKey="aurora"
              stroke="var(--color-chart-1)"
              fill="var(--color-chart-1)"
              fillOpacity={0.35}
            />
            <Radar
              name="DynamoDB"
              dataKey="dynamo"
              stroke="var(--color-chart-4)"
              fill="var(--color-chart-4)"
              fillOpacity={0.2}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              iconType="circle"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
