"use client"

import Link from "next/link"
import { useStoreValue } from "@simplestack/store/react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { QuantityStepper } from "@/components/shared/quantity-stepper"
import { cartItemsStore, cartOpenStore, cartSubtotal, removeFromCart, updateQuantity } from "@/stores/cart-store"
import { formatPrice } from "@/lib/utils"
import { X, ShoppingBag } from "lucide-react"

export function CartDrawer() {
  const items = useStoreValue(cartItemsStore) ?? []
  const isOpen = useStoreValue(cartOpenStore) ?? false
  const subtotal = cartSubtotal(items)

  return (
    <Sheet open={isOpen} onOpenChange={(open) => cartOpenStore.set(open)}>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="flex-row items-center justify-between space-y-0">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" /> Your Bag ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="font-display text-lg">Your bag is empty</p>
            <p className="text-sm text-muted-foreground">Time pieces worth having take a moment to choose.</p>
            <Button variant="outline" onClick={() => cartOpenStore.set(false)} asChild>
              <Link href="/shop">Browse the collection</Link>
            </Button>
          </div>
        ) : (
          <div className="flex-1 divide-y divide-border overflow-y-auto px-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 py-5">
                <Link
                  href={`/products/${item.slug}`}
                  onClick={() => cartOpenStore.set(false)}
                  className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary"
                >
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={() => cartOpenStore.set(false)}
                        className="font-display text-sm leading-tight hover:text-foreground/70"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.variantLabel}</p>
                    </div>
                    <button
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <QuantityStepper value={item.quantity} onChange={(q) => updateQuantity(item.id, q)} className="h-8" />
                    <span className="font-mono text-sm">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <SheetFooter className="flex flex-col gap-3">
            <div className="flex items-center justify-between font-display text-lg">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
            <Button size="lg" variant="brass" className="w-full" asChild onClick={() => cartOpenStore.set(false)}>
              <Link href="/checkout">Checkout</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full" asChild onClick={() => cartOpenStore.set(false)}>
              <Link href="/cart">View Bag</Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
