import { Skeleton } from "@/components/ui/skeleton"
import { ProductGridSkeleton } from "./product-grid-skeleton"
import { SkeletonShell } from "./skeleton-shell"

/** Category tile placeholder: the 3/4 portrait cards under the hero. */
export function CategoryTileGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
      ))}
    </div>
  )
}

/** Hero carousel placeholder — matches the ink slab and its min-heights. */
export function HeroSkeleton() {
  return (
    <div className="bg-ink relative overflow-hidden">
      <div className="container flex min-h-[560px] items-center py-20 sm:min-h-[640px]">
        <div className="max-w-xl space-y-6">
          <Skeleton className="bg-background/10 h-3 w-40" />
          <div className="space-y-3">
            <Skeleton className="bg-background/10 h-12 w-full sm:h-16" />
            <Skeleton className="bg-background/10 h-12 w-2/3 sm:h-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="bg-background/10 h-4 w-full" />
            <Skeleton className="bg-background/10 h-4 w-4/5" />
          </div>
          <Skeleton className="bg-background/10 h-12 w-48 rounded-full" />
          <div className="flex items-center gap-3 pt-6">
            <div className="flex -space-x-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="bg-background/10 h-8 w-8 rounded-full" />
              ))}
            </div>
            <Skeleton className="bg-background/10 h-6 w-28" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Section heading placeholder: eyebrow + title, with an optional right action. */
export function SectionHeadingSkeleton({
  action = true,
  centered = false,
}: {
  action?: boolean
  centered?: boolean
}) {
  if (centered) {
    return (
      <div className="mb-10 flex flex-col items-center gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-64" />
      </div>
    )
  }
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-9 w-72" />
      </div>
      {action && <Skeleton className="h-11 w-40 rounded-full" />}
    </div>
  )
}

/** Whole-page placeholder for the storefront home page. */
export function HomeSkeleton() {
  return (
    <SkeletonShell label="Loading home page">
      <HeroSkeleton />

      <section className="container py-16 sm:py-20">
        <SectionHeadingSkeleton />
        <CategoryTileGridSkeleton />
      </section>

      <section className="bg-secondary/50 py-16 sm:py-20">
        <div className="container">
          <SectionHeadingSkeleton />
          <ProductGridSkeleton count={4} columns="grid-cols-2 lg:grid-cols-4" />
        </div>
      </section>

      <section className="container py-16 sm:py-20">
        <SectionHeadingSkeleton centered />
        <ProductGridSkeleton count={3} columns="grid-cols-1 sm:grid-cols-3" />
      </section>
    </SkeletonShell>
  )
}
