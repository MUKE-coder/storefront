import { Skeleton } from "@/components/ui/skeleton"
import { ProductGridSkeleton } from "./product-grid-skeleton"
import { SkeletonShell } from "./skeleton-shell"

/** The left filter rail: two grouped checkbox lists. */
export function ShopFiltersSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="mb-4 h-3 w-20" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="mb-4 h-3 w-24" />
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}

/** Full shop page: header, filter rail, sort toolbar and the 3-up grid. */
export function ShopSkeleton({ count = 9 }: { count?: number }) {
  return (
    <SkeletonShell label="Loading watches">
      <div className="container py-12">
        <div className="border-border mb-8 flex flex-col gap-3 border-b pb-8">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-80" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <ShopFiltersSkeleton />
          </aside>

          <div>
            <div className="mb-6 flex items-center justify-between gap-3">
              <Skeleton className="h-9 w-24 rounded-full lg:hidden" />
              <Skeleton className="ml-auto h-10 w-44" />
            </div>
            <ProductGridSkeleton count={count} columns="grid-cols-2 md:grid-cols-3" />
          </div>
        </div>
      </div>
    </SkeletonShell>
  )
}
