"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function StarRating({ rating, size = 14, showValue = false, count }: { rating: number; size?: number; showValue?: boolean; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(rating)
          return (
            <Star
              key={i}
              size={size}
              className={cn(filled ? "fill-brass text-brass" : "fill-transparent text-muted-foreground/40")}
            />
          )
        })}
      </div>
      {showValue && <span className="text-xs text-muted-foreground">{rating.toFixed(1)}</span>}
      {typeof count === "number" && <span className="text-xs text-muted-foreground">({count.toLocaleString()})</span>}
    </div>
  )
}
