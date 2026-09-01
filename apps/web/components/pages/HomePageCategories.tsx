'use client'

import { CategoryTileGridSkeleton } from '@/components/skeletons'
import { CategoryGridError } from '@/components/errors'
import { QueryBoundary } from '@/components/query-boundary'
import { useCategories } from '@/hooks/use-catalogue'

import CategoryListing from '../grit-ui/store-categories/two-row-category-rail'

/**
 * The category rail on the home page. One fetch, so one boundary — its
 * skeleton and its error belong to this strip alone and do not disturb the
 * product rows loading beside it.
 */
export default function HomePageCategories() {
  const categories = useCategories()

  return (
    <QueryBoundary
      query={categories}
      skeleton={<CategoryTileGridSkeleton />}
      error={({ retry, error }) => <CategoryGridError onRetry={retry} error={error} />}
    >
      {(data) => <CategoryListing categories={data.data ?? []} />}
    </QueryBoundary>
  )
}
