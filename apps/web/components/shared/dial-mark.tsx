"use client"

import { cn } from "@/lib/utils"

/** Trig on the server and in the browser can disagree in the last ULP, which
 * React reports as a hydration mismatch. Rounding makes both sides serialise
 * the tick coordinates identically. */
const round = (n: number) => Math.round(n * 1000) / 1000

/** Signature mark: a minimal watch-bezel of 12 ticks, used as the brand's recurring motif. */
export function DialMark({ className }: { className?: string }) {
  const ticks = Array.from({ length: 12 })
  return (
    <svg viewBox="0 0 40 40" className={cn("h-6 w-6", className)} aria-hidden="true">
      <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="1" />
      {ticks.map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const long = i % 3 === 0
        const r1 = long ? 13 : 15.5
        const r2 = 17.5
        const x1 = round(20 + r1 * Math.sin(angle))
        const y1 = round(20 - r1 * Math.cos(angle))
        const x2 = round(20 + r2 * Math.sin(angle))
        const y2 = round(20 - r2 * Math.cos(angle))
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth={long ? 1.6 : 0.9}
            strokeLinecap="round"
          />
        )
      })}
      <line x1="20" y1="20" x2="20" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="20" y1="20" x2="27" y2="20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="20" cy="20" r="1.4" fill="currentColor" />
    </svg>
  )
}
