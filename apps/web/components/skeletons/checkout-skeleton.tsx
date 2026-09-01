import { Skeleton } from "@/components/ui/skeleton"
import { OrderSummarySkeleton } from "./cart-skeleton"
import { SkeletonShell } from "./skeleton-shell"

/** One titled block of the checkout form. */
function FormSectionSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <section className="space-y-5">
      <Skeleton className="h-8 w-52" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </section>
  )
}

/** /checkout — stepper, the four form blocks, and the sticky summary. */
export function CheckoutSkeleton() {
  return (
    <SkeletonShell label="Loading checkout">
      <div className="container py-12">
        <div className="mb-10 flex items-center justify-between gap-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <div className="space-y-12">
            <FormSectionSkeleton fields={6} />

            <section className="space-y-5">
              <Skeleton className="h-8 w-52" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="border-border flex items-center gap-4 rounded-xl border p-4"
                >
                  <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                  <Skeleton className="h-4 w-14" />
                </div>
              ))}
            </section>

            <FormSectionSkeleton fields={4} />

            <section className="space-y-5">
              <Skeleton className="h-8 w-52" />
              <div className="divide-border divide-y">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 py-4">
                    <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-44" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <OrderSummarySkeleton lines={4} />
        </div>
      </div>
    </SkeletonShell>
  )
}

/** /order-confirmation — the centred success panel. */
export function OrderConfirmationSkeleton() {
  return (
    <SkeletonShell label="Loading your order confirmation">
      <div className="container flex min-h-[70vh] flex-col items-center justify-center py-16">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="mt-6 h-3 w-32" />
        <Skeleton className="mt-4 h-11 w-full max-w-xl" />
        <Skeleton className="mt-4 h-4 w-full max-w-md" />
        <div className="border-border mt-10 w-full max-w-md space-y-4 rounded-2xl border p-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        <Skeleton className="mt-8 h-12 w-48 rounded-full" />
      </div>
    </SkeletonShell>
  )
}
