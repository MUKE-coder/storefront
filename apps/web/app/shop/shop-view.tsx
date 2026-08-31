"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SlidersHorizontal, X } from "lucide-react"
import { ProductCard } from "@/components/shared/product-card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categories, products } from "@/data/catalog"
import { cn } from "@/lib/utils"

type SortKey = "featured" | "price-asc" | "price-desc" | "rating"

export function ShopView({ activeCategories }: { activeCategories: string[] }) {
  const router = useRouter()
  const [sort, setSort] = React.useState<SortKey>("featured")
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  function toggleCategory(slug: string) {
    const next = activeCategories.includes(slug)
      ? activeCategories.filter((c) => c !== slug)
      : [...activeCategories, slug]
    const newParams = new URLSearchParams()
    next.forEach((c) => newParams.append("category", c))
    const qs = newParams.toString()
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false })
  }

  const filtered = products
    .filter((p) => (activeCategories.length ? activeCategories.includes(p.categorySlug) : true))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price
      if (sort === "price-desc") return b.price - a.price
      if (sort === "rating") return b.rating - a.rating
      return 0
    })

  const FilterPanel = (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-4">Category</p>
        <div className="space-y-3">
          {categories.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox checked={activeCategories.includes(c.slug)} onCheckedChange={() => toggleCategory(c.slug)} />
              {c.name}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="eyebrow mb-4">Availability</p>
        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox defaultChecked />
          In stock only
        </label>
      </div>
    </div>
  )

  return (
    <div className="container py-12">
      <div className="mb-8 flex flex-col gap-2 border-b border-border pb-8">
        <p className="eyebrow">{filtered.length} watches</p>
        <h1 className="font-display text-4xl">Shop All Watches</h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">{FilterPanel}</aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-3">
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </Button>
            {activeCategories.length > 0 && (
              <div className="hidden flex-wrap gap-2 lg:flex">
                {activeCategories.map((slug) => (
                  <button
                    key={slug}
                    onClick={() => toggleCategory(slug)}
                    className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs"
                  >
                    {categories.find((c) => c.slug === slug)?.name} <X className="h-3 w-3" />
                  </button>
                ))}
              </div>
            )}
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="ml-auto w-44">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="border border-dashed border-border py-24 text-center">
              <p className="font-display text-xl">No watches match those filters</p>
              <p className="mt-2 text-sm text-muted-foreground">Try clearing a filter to see more of the collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setFiltersOpen(false)} />
          <div className={cn("relative ml-auto h-full w-72 overflow-y-auto bg-background p-6 animate-fade-in")}>
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-lg">Filters</span>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>
            {FilterPanel}
            <Button className="mt-8 w-full" onClick={() => setFiltersOpen(false)}>
              Show {filtered.length} results
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
