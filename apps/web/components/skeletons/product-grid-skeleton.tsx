import { ProductCardSkeleton } from "./product-card-skeleton"
import { SkeletonShell } from "./skeleton-shell"
import { cn } from "@/lib/utils"

/**
 * Grid of product placeholders. `columns` takes the caller's own grid classes
 * so the skeleton lays out on exactly the same tracks as the real grid and the
 * page does not jump when the data lands.
 */
export function ProductGridSkeleton({
  count = 8,
  columns = "grid-cols-2 md:grid-cols-4",
  className,
}: {
  count?: number
  columns?: string
  className?: string
}) {
  return (
    <SkeletonShell label="Loading products">
      <div className={cn("grid gap-4 sm:gap-6", columns, className)}>
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </SkeletonShell>
  )
}
