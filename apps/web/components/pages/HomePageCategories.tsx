// apps/web/app/page.tsx
'use client'

import { ProductGridSkeleton } from '@/components/shop/product-grid-skeleton'
import { useCategories } from '@/hooks/use-catalogue'

import CategoryListing from '../grit-ui/store-categories/two-row-category-rail'

export default function HomePageCategories() {
  const { data, isLoading } = useCategories()

  if (isLoading) return <ProductGridSkeleton />

  return <CategoryListing categories={data?.data ?? []} />
}
