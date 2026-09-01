"use client"

import * as React from "react"
import { SectionError } from "@/components/errors"

/**
 * The three states of one fetch, in one place.
 *
 * A page rarely has a single fetch. The home page alone wants a hero, a
 * category rail, featured products and new arrivals, and those land at
 * different times and fail independently. Wrapping each one separately keeps a
 * dead endpoint local: the reader loses that strip and still gets the page.
 *
 *   <QueryBoundary
 *     query={categories}
 *     skeleton={<CategoryTileGridSkeleton />}
 *     error={({ retry, error }) => <CategoryGridError onRetry={retry} error={error} />}
 *   >
 *     {(data) => <CategoryRail categories={data.data} />}
 *   </QueryBoundary>
 *
 * Give every boundary its OWN skeleton and error — that pairing is the whole
 * point. Omitting `error` falls back to a generic section error.
 */

/** The slice of a React Query result this needs. Any v4/v5 result satisfies it. */
export interface QueryLike<T> {
  data: T | undefined
  isPending?: boolean
  isLoading?: boolean
  isError: boolean
  error: unknown
  refetch?: () => unknown
}

export interface QueryBoundaryProps<T> {
  query: QueryLike<T>
  /** Shown while the first page of data is in flight. */
  skeleton: React.ReactNode
  /** Shown when the fetch failed. Receives a retry bound to `refetch`. */
  error?: (ctx: { error: unknown; retry: () => void }) => React.ReactNode
  /**
   * Treat an empty result as its own state rather than rendering an empty
   * grid. Return null to fall through to `children`.
   */
  empty?: (data: T) => React.ReactNode
  children: React.ReactNode | ((data: T) => React.ReactNode)
}

export function QueryBoundary<T>({
  query,
  skeleton,
  error,
  empty,
  children,
}: QueryBoundaryProps<T>) {
  const { data, isError, refetch } = query
  // v5 calls it isPending; v4 called it isLoading. Accept either.
  const pending = query.isPending ?? query.isLoading ?? false

  const retry = React.useCallback(() => {
    refetch?.()
  }, [refetch])

  if (pending) return <>{skeleton}</>

  if (isError || data === undefined) {
    if (error) return <>{error({ error: query.error, retry })}</>
    return <SectionError onRetry={refetch ? retry : undefined} error={query.error} />
  }

  if (empty) {
    const emptyNode = empty(data)
    if (emptyNode !== null && emptyNode !== undefined) return <>{emptyNode}</>
  }

  return <>{typeof children === "function" ? children(data) : children}</>
}
