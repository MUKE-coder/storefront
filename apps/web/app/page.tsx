import Link from 'next/link'
import { ArrowRight, ShieldCheck, Gem, Droplets, Award } from 'lucide-react'
import { HeroCarousel } from '@/components/shared/hero-carousel'
import { ProductCard } from '@/components/shared/product-card'
import { Button } from '@/components/ui/button'
import { categories, products } from '@/data/catalog'

export default function HomePage() {
  const featured = products.slice(0, 4)
  const newArrivals = products.filter((p) => p.badge === 'New Arrival').slice(0, 3)

  return (
    <div>
      <HeroCarousel />

      {/* Shop by Categories - moved directly under the hero, with imagery */}
      <section className="container py-16 sm:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">The Collections</p>
            <h2 className="font-display text-3xl sm:text-4xl">Shop by Categories</h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/categories">
              All Categories <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <img
                src={c.image}
                alt={c.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="from-ink/80 via-ink/10 absolute inset-0 bg-gradient-to-t to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-display text-background text-lg">{c.name}</p>
                <span className="text-background/70 text-xs">{c.children.length} collections</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-secondary/50 py-16 sm:py-20">
        <div className="container">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Curated for you</p>
              <h2 className="font-display text-3xl sm:text-4xl">Featured Products</h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/shop">
                View All Products <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container py-16 sm:py-20">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-2">Just landed</p>
          <h2 className="font-display text-3xl sm:text-4xl">New Arrivals</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button size="lg" asChild>
            <Link href="/shop">Our Shop</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
