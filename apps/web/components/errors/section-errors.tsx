"use client"

import { ImageOff, PackageX, LayoutGrid, ShoppingBag, Newspaper } from "lucide-react"
import { ErrorState, type ErrorStateProps } from "./error-state"
import { cn } from "@/lib/utils"

/**
 * Section-scoped failures.
 *
 * A page usually runs several independent fetches — the home page alone loads
 * a hero, a category rail, featured products and new arrivals. Each of those
 * gets its own skeleton and its own error here, so one dead endpoint costs the
 * reader that strip and nothing else.
 *
 * Each wrapper keeps roughly the footprint of the section it replaces.
 */

type SectionErrorProps = Omit<ErrorStateProps, "size" | "icon">

/** Generic section slot — use when nothing more specific fits. */
export function SectionError(props: SectionErrorProps) {
  return <ErrorState size="section" {...props} />
}

/** Stands in for the hero carousel: full-bleed ink slab, same min-heights. */
export function HeroError({ className, ...props }: SectionErrorProps) {
  return (
    <div className={cn("bg-ink flex min-h-[560px] items-center sm:min-h-[640px]", className)}>
      <div className="container">
        <ErrorState
          size="section"
          tone="inverted"
          icon={ImageOff}
          title="The showcase did not load"
          description="Our featured collection is temporarily unavailable. The rest of the store is still here."
          className="mx-auto max-w-lg py-12"
          {...props}
        />
      </div>
    </div>
  )
}

/** Stands in for a product grid — home rows, shop results, related, wishlist. */
export function ProductGridError(props: SectionErrorProps) {
  return (
    <ErrorState
      size="section"
      icon={PackageX}
      title="Watches could not be loaded"
      description="The catalogue did not respond. Try again in a moment."
      {...props}
    />
  )
}

/** Stands in for the category tiles or the collection rail. */
export function CategoryGridError(props: SectionErrorProps) {
  return (
    <ErrorState
      size="section"
      icon={LayoutGrid}
      title="Collections could not be loaded"
      description="We could not reach the collection list. Try again in a moment."
      {...props}
    />
  )
}

/** Stands in for a cart or checkout money panel. Compact, fits the card. */
export function SummaryError(props: SectionErrorProps) {
  return (
    <div className="border-border h-fit rounded-2xl border p-2">
      <ErrorState
        size="inline"
        icon={ShoppingBag}
        title="Totals unavailable"
        description="We could not price this order just now."
        className="border-none"
        {...props}
      />
    </div>
  )
}

/** Stands in for the blog card grid. */
export function BlogGridError(props: SectionErrorProps) {
  return (
    <ErrorState
      size="section"
      icon={Newspaper}
      title="Posts could not be loaded"
      description="The journal did not respond. Try again in a moment."
      {...props}
    />
  )
}
