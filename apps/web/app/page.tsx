import Link from "next/link"
import { ArrowRight, ShieldCheck, Gem, Droplets, Award } from "lucide-react";
import { HeroCarousel } from "@/components/shared/hero-carousel";
import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import { categories, products } from "@/data/catalog";
import { img } from "@/data/images";

const featureGrid = [
  {
    icon: ShieldCheck,
    title: "Trusted Precision",
    copy: "High-quality quartz and automatic movements ensure accurate, dependable timekeeping.",
  },
  {
    icon: Gem,
    title: "Elegant Craftsmanship",
    copy: "Refined designs with premium finishes, crafted for everyday elegance.",
  },
  {
    icon: Droplets,
    title: "Water Resistant Build",
    copy: "Designed to handle daily splashes and light water exposure with ease.",
  },
  {
    icon: Award,
    title: "Durable Materials",
    copy: "Strong cases and scratch-resistant glass for long-lasting performance.",
  },
];

const lifestyleGrid = [
  {
    title: "Crafted for Every Second",
    copy: "Precision meets elegance",
    image: img.dress2,
    cta: true,
  },
  {
    title: "Premium Materials",
    copy: "Scratch & shock resistant",
    image: img.automatic1,
  },
  {
    title: "Precision Inside",
    copy: "Swiss automatic movement",
    image: img.chrono2,
  },
  {
    title: "Built to Last",
    copy: "10 ATM water resistance",
    image: img.diver3,
  },
  {
    title: "Your Style, Your Watch",
    copy: "Multiple dial colors",
    image: img.lifestyle1,
  },
  {
    title: "Trusted Worldwide",
    copy: "10,000+ customers",
    image: img.lifestyle2,
  },
];

export default function HomePage() {
  const featured = products.slice(0, 4);
  const newArrivals = products
    .filter((p) => p.badge === "New Arrival")
    .slice(0, 3);

  return (
    <div>
      <HeroCarousel />

      {/* Shop by Categories - moved directly under the hero, with imagery */}
      <section className="container py-16 sm:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">The Collections</p>
            <h2 className="font-display text-3xl sm:text-4xl">
              Shop by Categories
            </h2>
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
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-display text-lg text-background">{c.name}</p>
                <span className="text-xs text-background/70">
                  {c.children.length} collections
                </span>
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
              <h2 className="font-display text-3xl sm:text-4xl">
                Featured Products
              </h2>
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
  );
}
