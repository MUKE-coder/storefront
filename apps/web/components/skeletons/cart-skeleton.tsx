import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonShell } from "./skeleton-shell"

/** Right-hand money panel, shared by the cart and checkout skeletons. */
export function OrderSummarySkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="border-border h-fit rounded-2xl border p-6">
      <Skeleton className="h-6 w-40" />
      <div className="mt-6 space-y-4">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex justify-between gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
      <div className="border-border mt-6 border-t pt-6">
        <div className="flex justify-between gap-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      <Skeleton className="mt-6 h-12 w-full rounded-full" />
    </div>
  )
}

/** /cart — line-item table on the left, summary panel on the right. */
export function CartSkeleton({ items = 3 }: { items?: number }) {
  return (
    <SkeletonShell label="Loading your bag">
      <div className="container py-12">
        <Skeleton className="mb-10 h-11 w-56" />

        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="border-border hidden grid-cols-[100px_1fr_140px_100px_40px] gap-4 border-b pb-3 sm:grid">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-16" />
              ))}
            </div>

            <div className="divide-border divide-y">
              {Array.from({ length: items }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[80px_1fr] items-center gap-4 py-6 sm:grid-cols-[100px_1fr_140px_100px_40px]"
                >
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="hidden h-10 w-28 rounded-full sm:block" />
                  <Skeleton className="hidden h-4 w-16 sm:block" />
                  <Skeleton className="hidden h-8 w-8 rounded-full sm:block" />
                </div>
              ))}
            </div>
          </div>

          <OrderSummarySkeleton />
        </div>
      </div>
    </SkeletonShell>
  )
}
