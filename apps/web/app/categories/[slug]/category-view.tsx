"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getCategoryBySlug, getProductsByCategory } from "@/data/catalog"
import { ProductCard } from "@/components/shared/product-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CategoryView({
  slug,
  activeChild,
}: {
  slug: string
  activeChild: string | null
}) {
  const router = useRouter()
  const category = getCategoryBySlug(slug)

  // Hooks have to run on every render, so resolve the product list before the
  // not-found bail-out rather than after it (React Router allowed the reverse).
  const products = React.useMemo(
    () => (category ? getProductsByCategory(category.slug) : []),
    [category]
  )

  const setCollection = React.useCallback(
    (child: string | null) => {
      const base = `/categories/${slug}`
      router.replace(child ? `${base}?collection=${child}` : base, { scroll: false })
    },
    [router, slug]
  )

  if (!category) return null
  // level-2 categories don't have their own product assignment in the mock data,
  // so we spread the parent's catalog across children deterministically for a realistic browse experience.
  const productsForChild = (childIndex: number) => products.filter((_, i) => i % category.children.length === childIndex)

  const visibleProducts = activeChild
    ? productsForChild(category.children.findIndex((c) => c.slug === activeChild))
    : products

  return (
    <div>
      <section className="relative">
        <div className="absolute inset-0">
          <img src={category.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
        </div>
        <div className="container relative flex min-h-[320px] flex-col justify-end gap-3 py-12 text-background sm:min-h-[380px]">
          <p className="eyebrow text-brass-light">Collection</p>
          <h1 className="font-display text-4xl sm:text-5xl">{category.name}</h1>
          <p className="max-w-lg text-background/70">{category.description}</p>
        </div>
      </section>

      <section className="container py-10">
        <p className="eyebrow mb-4">Refine by collection</p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setCollection(null)}
            className={cn(
              "border px-4 py-2 text-sm transition-colors",
              !activeChild ? "rounded-full border-ink bg-ink text-background" : "rounded-full border-border hover:border-ink/40"
            )}
          >
            All {category.name}
          </button>
          {category.children.map((child) => (
            <button
              key={child.id}
              onClick={() => setCollection(child.slug)}
              className={cn(
                "flex items-center gap-3 border px-3 py-2 text-sm transition-colors",
                activeChild === child.slug ? "rounded-full border-ink bg-ink text-background" : "rounded-full border-border hover:border-ink/40"
              )}
            >
              <img src={child.image} alt="" className="h-8 w-8 rounded-full object-cover" />
              {child.name}
            </button>
          ))}
        </div>
      </section>

      <section className="container pb-20">
        {visibleProducts.length === 0 ? (
          <div className="border border-dashed border-border py-20 text-center">
            <p className="font-display text-xl">No watches here yet</p>
            <p className="mt-2 text-sm text-muted-foreground">Check back soon, or browse the full {category.name.toLowerCase()} range.</p>
            <Button variant="outline" className="mt-6" asChild>
              <Link href={`/categories/${category.slug}`}>View all {category.name}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
