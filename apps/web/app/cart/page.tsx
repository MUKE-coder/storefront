"use client"

import Link from "next/link"
import { useStoreValue } from "@simplestack/store/react"
import { ArrowRight, X, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuantityStepper } from "@/components/shared/quantity-stepper"
import { cartItemsStore, cartSubtotal, removeFromCart, updateQuantity } from "@/stores/cart-store"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const items = useStoreValue(cartItemsStore) ?? []
  const subtotal = cartSubtotal(items)

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        <h1 className="font-display text-3xl">Your bag is empty</h1>
        <p className="max-w-sm text-muted-foreground">Browse the collection and find a piece worth the wait.</p>
        <Button size="lg" asChild>
          <Link href="/shop">Shop the Collection</Link>
        </Button>
      </div>
    )
  }

  const shipping = subtotal >= 200 ? 0 : 15
  const tax = Math.round(subtotal * 0.08)
  const total = subtotal + shipping + tax

  return (
    <div className="container py-12">
      <h1 className="mb-10 font-display text-4xl">Your Bag</h1>

      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="hidden grid-cols-[100px_1fr_140px_100px_40px] gap-4 border-b border-border pb-3 text-xs uppercase tracking-[0.14em] text-muted-foreground sm:grid">
            <span>Item</span>
            <span></span>
            <span>Quantity</span>
            <span className="text-right">Total</span>
            <span></span>
          </div>
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[80px_1fr] items-center gap-4 py-6 sm:grid-cols-[100px_1fr_140px_100px_40px]"
              >
                <Link href={`/products/${item.slug}`} className="aspect-square w-full overflow-hidden rounded-xl bg-secondary">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </Link>
                <div>
                  <Link href={`/products/${item.slug}`} className="font-display text-lg hover:text-foreground/70">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{item.variantLabel}</p>
                  <p className="mt-1 font-mono text-sm sm:hidden">{formatPrice(item.price)}</p>
                  <div className="mt-3 sm:hidden">
                    <QuantityStepper value={item.quantity} onChange={(q) => updateQuantity(item.id, q)} className="h-9" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <QuantityStepper value={item.quantity} onChange={(q) => updateQuantity(item.id, q)} />
                </div>
                <span className="hidden text-right font-mono text-sm sm:block">{formatPrice(item.price * item.quantity)}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="justify-self-end text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="Remove item"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <Button variant="outline" asChild className="mt-8">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>

        <div className="h-fit rounded-2xl border border-border p-6">
          <h2 className="font-display text-xl">Order Summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-mono">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Tax</span>
              <span className="font-mono">{formatPrice(tax)}</span>
            </div>
          </div>
          <div className="my-5 h-px bg-border" />
          <div className="flex justify-between font-display text-xl">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          {subtotal < 200 && (
            <p className="mt-3 text-xs text-muted-foreground">Add {formatPrice(200 - subtotal)} more for free shipping.</p>
          )}
          <Button size="lg" variant="brass" className="mt-6 w-full" asChild>
            <Link href="/checkout">
              Checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
