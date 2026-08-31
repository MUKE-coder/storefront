"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { categories } from "@/data/catalog"
import { cn } from "@/lib/utils"

/**
 * A horizontally scrollable strip of category and sub-category chips,
 * shown site-wide directly beneath the main navigation bar. Text only —
 * no imagery — so it stays lightweight even with the full catalog listed.
 */
export function CategoryScrollBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const chips: { label: string; to: string }[] = [
    { label: "All Watches", to: "/shop" },
    ...categories.flatMap((c) => [
      { label: c.name, to: `/categories/${c.slug}` },
      ...c.children.map((child) => ({
        label: child.name,
        to: `/categories/${c.slug}?collection=${child.slug}`,
      })),
    ]),
  ]

  return (
    <div className="border-b border-border bg-background">
      <div className="container">
        <nav
          aria-label="Browse categories"
          className="no-scrollbar flex items-center gap-2 overflow-x-auto py-3"
        >
          {chips.map((chip) => {
            const search = searchParams.toString()
            const current = pathname + (search ? `?${search}` : "")
            const isActive = current === chip.to
            return (
              <Link
                key={chip.label + chip.to}
                href={chip.to}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "border-ink bg-ink text-background"
                    : "border-border text-foreground/70 hover:border-ink/40 hover:text-foreground"
                )}
              >
                {chip.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
