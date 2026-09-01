import { Skeleton } from "@/components/ui/skeleton"
import { ProductGridSkeleton } from "./product-grid-skeleton"
import { SkeletonShell } from "./skeleton-shell"

/**
 * The account shell — avatar header plus the sidebar nav. Only needed when the
 * customer record itself is still loading; the nested pages below render
 * inside the real layout and skeleton just their own panel.
 */
export function AccountLayoutSkeleton({ children }: { children?: React.ReactNode }) {
  return (
    <div className="container py-12">
      <div className="mb-10 flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-48" />
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside>
          <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 shrink-0 rounded-none lg:w-full" />
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  )
}

/** /account — loyalty panel, the three stat tiles, recent orders. */
export function AccountOverviewSkeleton() {
  return (
    <SkeletonShell label="Loading your account">
      <div className="space-y-8">
        <div className="border-border rounded-2xl border p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-7 w-32" />
            </div>
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="mt-6 h-2 w-full rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-border flex flex-col gap-3 rounded-2xl border p-6">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-7 w-10" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="border-border divide-border divide-y rounded-2xl border">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="ml-auto h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonShell>
  )
}

/** /account/orders — the filterable order history table. */
export function AccountOrdersSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <SkeletonShell label="Loading order history">
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-10 w-48" />
        </div>

        <div className="border-border overflow-hidden rounded-2xl border">
          <div className="border-border bg-secondary/50 grid grid-cols-5 gap-4 border-b p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-16" />
            ))}
          </div>
          <div className="divide-border divide-y">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 items-center gap-4 p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-14" />
                <Skeleton className="ml-auto h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonShell>
  )
}

/** /account/orders/[orderId] — tracking panel, item list, address + totals. */
export function OrderDetailSkeleton({ items = 2 }: { items?: number }) {
  return (
    <SkeletonShell label="Loading order">
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-40" />
          </div>
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>

        <div className="border-border mb-10 rounded-2xl border p-6">
          <Skeleton className="mb-6 h-6 w-56" />
          <div className="flex items-center justify-between gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <Skeleton className="mb-4 h-6 w-20" />
            <div className="divide-border divide-y">
              {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-4">
                  <Skeleton className="h-20 w-20 shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-44" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>

          <div className="h-fit space-y-6">
            <div className="border-border space-y-3 rounded-2xl border p-5">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="border-border rounded-2xl border p-5">
              <Skeleton className="mb-3 h-5 w-40" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
              <div className="border-border mt-4 flex justify-between gap-4 border-t pt-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonShell>
  )
}

/** /account/profile — the settings form, comms toggles and danger zone. */
export function AccountProfileSkeleton() {
  return (
    <SkeletonShell label="Loading profile settings">
      <div className="max-w-xl space-y-10">
        <section>
          <Skeleton className="mb-6 h-7 w-48" />
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
            </div>
            <Skeleton className="h-11 w-36 rounded-full" />
          </div>
        </section>

        <section>
          <Skeleton className="mb-4 h-7 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Skeleton className="h-4 w-4 rounded-sm" />
                <Skeleton className="h-4 w-56" />
              </div>
            ))}
          </div>
        </section>

        <section>
          <Skeleton className="mb-2 h-7 w-36" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="mt-4 h-11 w-40 rounded-full" />
        </section>
      </div>
    </SkeletonShell>
  )
}

/** /account/addresses — the saved-address cards. */
export function AccountAddressesSkeleton({ count = 4 }: { count?: number }) {
  return (
    <SkeletonShell label="Loading saved addresses">
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="border-border space-y-3 rounded-2xl border p-6">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-14" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonShell>
  )
}

/** /account/wishlist — heading plus the saved-product grid. */
export function AccountWishlistSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div>
      <Skeleton className="mb-6 h-7 w-32" />
      <ProductGridSkeleton count={count} columns="grid-cols-2 md:grid-cols-3" />
    </div>
  )
}
