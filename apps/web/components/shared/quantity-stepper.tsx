"use client"

import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export function QuantityStepper({
  value,
  onChange,
  className,
  min = 1,
  max = 10,
}: {
  value: number
  onChange: (value: number) => void
  className?: string
  min?: number
  max?: number
}) {
  return (
    <div className={cn("inline-flex h-10 items-center border border-input", className)}>
      <button
        type="button"
        aria-label="Decrease quantity"
        className="flex h-full w-9 items-center justify-center text-foreground/70 transition-colors hover:bg-muted disabled:opacity-30"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="flex h-full w-10 items-center justify-center border-x border-input font-mono text-sm">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="flex h-full w-9 items-center justify-center text-foreground/70 transition-colors hover:bg-muted disabled:opacity-30"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
