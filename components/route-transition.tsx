"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

const STATUS_MESSAGES = [
  "Analyzing infrastructure…",
  "Building migration intelligence…",
  "Preparing insights…",
]

const MIN_DURATION = 400
const MAX_DURATION = 900

type Phase = "idle" | "showing" | "hiding"

export function RouteTransition() {
  const pathname = usePathname()
  const [phase, setPhase] = useState<Phase>("idle")
  const [statusIndex, setStatusIndex] = useState(0)

  const startTimeRef = useRef(0)
  const statusTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const removeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const targetPathRef = useRef<string | null>(null)

  const clearTimers = useCallback(() => {
    if (statusTimerRef.current) clearInterval(statusTimerRef.current)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    if (removeTimerRef.current) clearTimeout(removeTimerRef.current)
  }, [])

  const begin = useCallback(
    (target: string) => {
      targetPathRef.current = target
      startTimeRef.current = Date.now()
      setStatusIndex(0)
      setPhase("showing")

      clearTimers()
      statusTimerRef.current = setInterval(() => {
        setStatusIndex((i) => Math.min(i + 1, STATUS_MESSAGES.length - 1))
      }, 280)

      // Safety: never leave the overlay up longer than MAX_DURATION.
      hideTimerRef.current = setTimeout(() => finish(), MAX_DURATION)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clearTimers],
  )

  const finish = useCallback(() => {
    if (statusTimerRef.current) clearInterval(statusTimerRef.current)
    setPhase("hiding")
    removeTimerRef.current = setTimeout(() => {
      setPhase("idle")
      targetPathRef.current = null
    }, 350)
  }, [])

  // Intercept internal link clicks to start the transition at navigation start.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const anchor = (e.target as HTMLElement)?.closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      const target = anchor.getAttribute("target")
      if (!href || target === "_blank") return
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#")
      )
        return

      const destination = href.split("?")[0].split("#")[0]
      if (destination === pathname) return

      begin(destination)
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [pathname, begin])

  // When the destination route has mounted, fade out after the minimum duration.
  useEffect(() => {
    if (phase !== "showing") return
    if (targetPathRef.current && pathname !== targetPathRef.current) return

    const elapsed = Date.now() - startTimeRef.current
    const remaining = Math.max(MIN_DURATION - elapsed, 0)
    const t = setTimeout(() => finish(), remaining)
    return () => clearTimeout(t)
  }, [pathname, phase, finish])

  useEffect(() => clearTimers, [clearTimers])

  if (phase === "idle") return null

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background ${
        phase === "hiding" ? "schemora-overlay-out" : "schemora-overlay-in"
      }`}
    >
      <SchemaNodes />

      {/* Electric blue accent glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl schemora-glow" />

      <div className="relative flex flex-col items-center">
        <div className="schemora-logo-in">
          <div className="schemora-pulse">
            <Image
              src="/schemora-logo.png"
              alt="Schemora"
              width={72}
              height={72}
              priority
              className="h-16 w-16 object-contain"
            />
          </div>
        </div>

        <p className="schemora-brand-in mt-5 text-lg font-semibold tracking-tight">
          Schem<span className="text-primary">ora</span>
        </p>

        <div className="schemora-status-in mt-3 flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <span className="text-sm text-muted-foreground tabular-nums">
            {STATUS_MESSAGES[statusIndex]}
          </span>
        </div>
      </div>
    </div>
  )
}

function SchemaNodes() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 800 600"
      fill="none"
    >
      <g className="schemora-dash" stroke="oklch(0.62 0.19 253 / 0.5)" strokeWidth="1.5">
        <line x1="120" y1="140" x2="300" y2="220" />
        <line x1="300" y1="220" x2="500" y2="160" />
        <line x1="500" y1="160" x2="680" y2="260" />
        <line x1="300" y1="220" x2="340" y2="430" />
        <line x1="340" y1="430" x2="540" y2="480" />
        <line x1="540" y1="480" x2="680" y2="380" />
        <line x1="120" y1="140" x2="180" y2="360" />
      </g>
      <g fill="oklch(0.62 0.19 253 / 0.85)">
        {[
          [120, 140],
          [300, 220],
          [500, 160],
          [680, 260],
          [340, 430],
          [540, 480],
          [680, 380],
          [180, 360],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3.5" />
        ))}
      </g>
    </svg>
  )
}
