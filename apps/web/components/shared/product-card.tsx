"use client"

import Link from "next/link"
import type { Product } from "@/types"
import { Badge } from "@/components/ui/badge"
import { formatPrice, cn } from "@/lib/utils"

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-ink/30",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {product.badge && (
          <Badge
            variant={product.badge === "50% Off" ? "sale" : product.badge === "New Arrival" ? "brass" : "outline"}
            className="absolute left-3 top-3 z-10"
          >
            {product.badge}
          </Badge>
        )}
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <img
          src={product.images[1] ?? product.images[0]}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>
      <div className="space-y-1.5 p-4">
        <p className="eyebrow">{product.collection}</p>
        <h3 className="font-display text-base leading-snug">{product.name}</h3>
        <p className="font-mono text-xs text-muted-foreground">{product.sku}</p>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="font-mono text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
