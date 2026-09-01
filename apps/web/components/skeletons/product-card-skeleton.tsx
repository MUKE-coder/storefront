import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/** Mirrors ProductCard: square image, collection eyebrow, name, SKU, price. */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("border-border bg-card overflow-hidden rounded-2xl border", className)}>
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-2.5 w-20" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <div className="pt-1">
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}
