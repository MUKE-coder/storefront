import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonShell } from "./skeleton-shell"

/**
 * Just the card grid. Use this when the page has already drawn its own
 * heading and only the posts are still in flight.
 */
export function BlogCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <SkeletonShell label="Loading blog posts">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="border-border overflow-hidden rounded-xl border">
            <Skeleton className="h-52 w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="mt-4 h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonShell>
  )
}

/** /blog — the whole page, heading included. For a `loading.tsx`. */
export function BlogListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12 space-y-3">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-4 w-80" />
      </div>
      <BlogCardGridSkeleton count={count} />
    </div>
  )
}

/** /blog/[slug] — back link, title, meta, cover image, body copy. */
export function BlogDetailSkeleton() {
  return (
    <SkeletonShell label="Loading blog post">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Skeleton className="mb-8 h-4 w-24" />
        <Skeleton className="mb-4 h-9 w-3/4" />
        <Skeleton className="mb-12 h-4 w-40" />
        <Skeleton className="mb-12 aspect-[2/1] w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </SkeletonShell>
  )
}
