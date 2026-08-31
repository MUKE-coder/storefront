"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Truck, ShieldCheck, RotateCcw, Check } from "lucide-react"
import { getProductBySlug, getRelatedProducts } from "@/data/catalog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuantityStepper } from "@/components/shared/quantity-stepper"
import { ProductCard } from "@/components/shared/product-card"
import { addToCart, lineId } from "@/stores/cart-store"
import { cn, formatPrice } from "@/lib/utils"

export function ProductView() {
  const { slug } = useParams<{ slug: string }>()
  const product = getProductBySlug(slug ?? "")

  const [activeImage, setActiveImage] = React.useState(0)
  const [selection, setSelection] = React.useState<Record<string, string>>({})
  const [quantity, setQuantity] = React.useState(1)
  const [justAdded, setJustAdded] = React.useState(false)

  React.useEffect(() => {
    if (!product) return
    const defaults: Record<string, string> = {}
    product.variantGroups.forEach((g) => {
      const firstAvailable = g.options.find((o) => o.inStock) ?? g.options[0]
      defaults[g.key] = firstAvailable.id
    })
    setSelection(defaults)
    setActiveImage(0)
    setQuantity(1)
  }, [product])

  if (!product) return null

  const related = getRelatedProducts(product)
  const strapGroup = product.variantGroups.find((g) => g.key === "strap")
  const selectedStrap = strapGroup?.options.find((o) => o.id === selection.strap)
  const galleryImages = selectedStrap?.image
    ? [selectedStrap.image, ...product.images.filter((i) => i !== selectedStrap.image)]
    : product.images

  // Every variant group can carry its own priceDelta; the displayed price
  // (and the price stored on the cart line) is the base price plus the sum
  // of the currently-selected option's deltas across all groups.
  const variantDelta = product.variantGroups.reduce((sum, group) => {
    const selected = group.options.find((o) => o.id === selection[group.key])
    return sum + (selected?.priceDelta ?? 0)
  }, 0)
  const unitPrice = product.price + variantDelta

  const variantLabel = product.variantGroups
    .map((g) => g.options.find((o) => o.id === selection[g.key])?.label)
    .filter(Boolean)
    .join(" / ")

  function handleAddToCart() {
    addToCart(
      {
        id: lineId(product!.id, selection),
        productId: product!.id,
        slug: product!.slug,
        name: product!.name,
        image: product!.images[0],
        price: unitPrice,
        variantLabel,
        variantSelection: selection,
      },
      quantity
    )
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <div className="container py-10">
      <nav className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href={`/categories/${product.categorySlug}`} className="capitalize hover:text-foreground">{product.categorySlug}</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          <div className="flex shrink-0 gap-3 sm:flex-col">
            {galleryImages.map((image, i) => (
              <button
                key={image + i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors sm:h-20 sm:w-20",
                  activeImage === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <img src={image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="aspect-square flex-1 overflow-hidden rounded-2xl bg-secondary">
            <img src={galleryImages[activeImage] ?? galleryImages[0]} alt={product.name} className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-3">
            {product.badge && <Badge variant={product.badge === "50% Off" ? "sale" : "brass"}>{product.badge}</Badge>}
            <p className="eyebrow">{product.collection}</p>
          </div>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl">{product.name}</h1>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-mono text-2xl">{formatPrice(unitPrice)}</span>
            {product.compareAtPrice && (
              <span className="font-mono text-base text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
            {product.compareAtPrice && (
              <Badge variant="sale">Save {formatPrice(product.compareAtPrice - product.price)}</Badge>
            )}
            {variantDelta !== 0 && (
              <span className="font-mono text-xs text-muted-foreground">
                (base {formatPrice(product.price)} {variantDelta > 0 ? "+" : "-"} {formatPrice(Math.abs(variantDelta))})
              </span>
            )}
          </div>

          <p className="mt-6 max-w-lg text-muted-foreground">{product.description}</p>

          <Separator className="my-7" />

          {/* Variants */}
          <div className="space-y-6">
            {product.variantGroups.map((group) => (
              <div key={group.key}>
                <div className="mb-3 flex items-baseline justify-between">
                  <Label className="!text-xs">{group.name}</Label>
                  <span className="text-xs text-muted-foreground">
                    {group.options.find((o) => o.id === selection[group.key])?.label}
                    {(() => {
                      const opt = group.options.find((o) => o.id === selection[group.key])
                      if (!opt?.priceDelta) return null
                      return ` (${opt.priceDelta > 0 ? "+" : "-"}${formatPrice(Math.abs(opt.priceDelta))})`
                    })()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {group.options.map((option) => {
                    const active = selection[group.key] === option.id
                    return (
                      <button
                        key={option.id}
                        disabled={!option.inStock}
                        onClick={() => setSelection((s) => ({ ...s, [group.key]: option.id }))}
                        title={option.priceDelta ? `${option.label} (${option.priceDelta > 0 ? "+" : "-"}${formatPrice(Math.abs(option.priceDelta))})` : option.label}
                        className={cn(
                          "relative h-11 w-11 rounded-full border-2 transition-all disabled:cursor-not-allowed disabled:opacity-30",
                          active ? "border-ink" : "border-transparent hover:border-ink/30"
                        )}
                      >
                        <span
                          className="absolute inset-1 rounded-full border border-ink/10"
                          style={{ backgroundColor: option.swatch }}
                        />
                        {!option.inStock && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="h-[1px] w-8 rotate-45 bg-foreground/40" />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-7" />

          <div className="flex flex-wrap items-center gap-4">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <Button size="lg" variant="brass" className="flex-1 min-w-[200px]" onClick={handleAddToCart}>
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" /> Added to Bag
                </>
              ) : (
                `Add to Bag · ${formatPrice(unitPrice * quantity)}`
              )}
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-3">
            <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 shrink-0" /> Free shipping over $200
            </div>
            <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0" /> 2-year warranty
            </div>
            <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <RotateCcw className="h-4 w-4 shrink-0" /> 30-day returns
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: description / specs / reviews */}
      <div className="mt-20">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Customer Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <div className="grid gap-10 lg:grid-cols-2">
              <p className="max-w-lg text-muted-foreground">{product.description}</p>
              <ul className="space-y-3">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" /> {h}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="specs">
            <dl className="grid max-w-2xl grid-cols-1 divide-y divide-border border-t border-border sm:grid-cols-2 sm:divide-y-0">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between border-b border-border py-3 sm:pr-8">
                  <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                  <dd className="text-sm font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="grid gap-6 sm:grid-cols-2">
              {product.reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-border p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{review.author}</p>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="mt-2 font-display text-base">{review.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{review.body}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Similar products */}
      {related.length > 0 && (
        <div className="mt-24">
          <p className="eyebrow mb-2">You might also like</p>
          <h2 className="mb-8 font-display text-3xl">Similar Watches</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground", className)}>{children}</span>
}
