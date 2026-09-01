// apps/web/app/page.tsx
'use client'

import { CategoryTileGridSkeleton } from '@/components/skeletons'
import { useCategories } from '@/hooks/use-catalogue'

import CategoryListing from '../grit-ui/store-categories/two-row-category-rail'

export default function HomePageCategories() {
  const { data, isLoading } = useCategories()

  if (isLoading) return <CategoryTileGridSkeleton />

  return <CategoryListing categories={data?.data ?? []} />
}
