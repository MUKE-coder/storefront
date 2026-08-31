import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { categories } from "@/data/catalog"

export default function CategoriesIndexPage() {
  return (
    <div className="container py-14">
      <div className="mb-12 max-w-xl">
        <p className="eyebrow mb-3">The full range</p>
        <h1 className="font-display text-4xl sm:text-5xl">Every Collection</h1>
        <p className="mt-4 text-muted-foreground">
          Five families of watches, each built around a distinct use — from timing a race to tracking the tide.
        </p>
      </div>

      <div className="space-y-px bg-border">
        {categories.map((c, i) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className="group flex flex-col gap-6 bg-background p-6 transition-colors hover:bg-secondary/50 sm:flex-row sm:items-center sm:p-8"
          >
            <span className="font-mono text-xs text-brass-dark">0{i + 1}</span>
            <div className="h-40 w-full shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-40">
              <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl sm:text-3xl">{c.name}</h2>
              <p className="mt-1 max-w-lg text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.children.map((child) => (
                  <span key={child.id} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                    {child.name}
                  </span>
                ))}
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-foreground/40 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-brass-dark" />
          </Link>
        ))}
      </div>
    </div>
  )
}
