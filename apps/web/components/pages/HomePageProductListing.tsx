// apps/web/app/page.tsx
'use client'

import ProductGridWithRatings, {
  type Product as GridProduct,
} from '@/components/grit-ui/product-grids/grid-with-ratings'

import { ProductGridSkeleton } from '@/components/skeletons'
import { useCatalogue } from '@/hooks/use-catalogue'
import { addToCart } from '@/lib/cart'

export default function HomePageProductListing() {
  const { data, isLoading } = useCatalogue()
  if (isLoading) return <ProductGridSkeleton count={8} columns="grid-cols-2 md:grid-cols-4" />

  const catalogue = data?.data ?? []

  const products: GridProduct[] = catalogue.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.compare_at_price > p.price ? p.compare_at_price : undefined,
    // The card rendition, not the full image. Twenty cards drawn from the
    // 1600px version is about four megabytes to render tiles a few hundred
    // pixels wide. Falls back to the original for anything uploaded before the
    // profile existed, or that the optimiser declined.
    image: p.images?.[0]?.url ?? '',
    href: `/products/${p.slug}`,
  }))

  // The block hands back its own shape, and the cart wants yours. Keep the
  // originals by id rather than rebuilding a product from what the block knows.
  const byID = new Map(catalogue.map((p) => [p.id, p]))

  return (
    <ProductGridWithRatings
      title="Featured products"
      viewAllHref="/products"
      products={products}
      onAdd={(item) => {
        const product = byID.get(item.id)
        if (product) addToCart(product)
      }}
    />
  )
}
