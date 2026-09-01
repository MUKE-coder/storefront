import { Skeleton } from "@/components/ui/skeleton"
import { ProductGridSkeleton } from "./product-grid-skeleton"
import { SkeletonShell } from "./skeleton-shell"

/** /categories — the stacked hairline-separated collection rows. */
export function CategoriesSkeleton({ count = 5 }: { count?: number }) {
  return (
    <SkeletonShell label="Loading collections">
      <div className="container py-14">
        <div className="mb-12 max-w-xl space-y-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-12 w-80" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="bg-border space-y-px">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="bg-background flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8"
            >
              <Skeleton className="h-3 w-6" />
              <Skeleton className="h-40 w-full shrink-0 rounded-2xl sm:h-28 sm:w-40" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full max-w-lg" />
                <div className="flex flex-wrap gap-2 pt-1">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-6 w-20 rounded-full" />
                  ))}
                </div>
              </div>
              <Skeleton className="h-5 w-5 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonShell>
  )
}

/** /categories/[slug] — dark banner, collection chips, then the product grid. */
export function CategoryDetailSkeleton({ count = 8 }: { count?: number }) {
  return (
    <SkeletonShell label="Loading collection">
      <div className="bg-ink">
        <div className="container flex min-h-[320px] flex-col justify-end gap-3 py-12 sm:min-h-[380px]">
          <Skeleton className="bg-background/10 h-3 w-24" />
          <Skeleton className="bg-background/10 h-12 w-72" />
          <Skeleton className="bg-background/10 h-4 w-full max-w-md" />
        </div>
      </div>

      <section className="container py-10">
        <Skeleton className="mb-4 h-3 w-40" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-full" />
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <ProductGridSkeleton
          count={count}
          columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        />
      </section>
    </SkeletonShell>
  )
}
