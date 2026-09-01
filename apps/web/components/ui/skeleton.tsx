import { cn } from "@/lib/utils"

/**
 * Base shimmer block every page skeleton is built from.
 *
 * Painted with `bg-foreground/10` rather than a fixed grey so it tracks the
 * active theme: a hardcoded neutral disappears against the midnight palette,
 * and a flat `bg-secondary` is too faint to read on white.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("bg-foreground/10 animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
