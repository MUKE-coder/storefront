import { Skeleton } from "@/components/ui/skeleton"
import { ProductGridSkeleton } from "./product-grid-skeleton"
import { SkeletonShell } from "./skeleton-shell"

/** /products/[slug] — gallery with thumb rail, buy box, tabs, related grid. */
export function ProductDetailSkeleton() {
  return (
    <SkeletonShell label="Loading product">
      <div className="container py-10">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-28" />
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="flex gap-4">
            <div className="hidden shrink-0 flex-col gap-3 sm:flex">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-xl" />
              ))}
            </div>
            <Skeleton className="aspect-square flex-1 rounded-2xl" />
          </div>

          {/* Buy box */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-4/5" />
              <Skeleton className="h-3 w-32" />
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>

            <Skeleton className="h-8 w-36" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Variant groups */}
            {Array.from({ length: 2 }).map((_, g) => (
              <div key={g} className="space-y-3">
                <Skeleton className="h-3 w-20" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, o) => (
                    <Skeleton key={o} className="h-11 w-24 rounded-full" />
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity + add to cart */}
            <div className="flex items-center gap-4 pt-2">
              <Skeleton className="h-12 w-32 rounded-full" />
              <Skeleton className="h-12 flex-1 rounded-full" />
            </div>

            {/* Assurances */}
            <div className="border-border grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Skeleton className="h-5 w-5 shrink-0" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20">
          <div className="border-border mb-8 flex gap-6 border-b pb-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-28" />
            ))}
          </div>
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="mt-20">
          <Skeleton className="mb-8 h-8 w-56" />
          <ProductGridSkeleton count={4} columns="grid-cols-2 md:grid-cols-4" />
        </div>
      </div>
    </SkeletonShell>
  )
}
