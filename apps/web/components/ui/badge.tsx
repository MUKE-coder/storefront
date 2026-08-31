"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-ink text-background border-ink",
        brass: "bg-brass text-background border-brass",
        outline: "border-ink/40 text-ink bg-transparent",
        sale: "bg-destructive text-destructive-foreground border-destructive",
        muted: "bg-muted text-muted-foreground border-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
