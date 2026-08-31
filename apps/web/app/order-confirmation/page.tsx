"use client"

import * as React from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialMark } from "@/components/shared/dial-mark"
import { formatPrice } from "@/lib/utils"
import { LAST_ORDER_TOTAL_KEY } from "@/stores/cart-store"

export default function OrderConfirmationPage() {
  const [total, setTotal] = React.useState(0)
  const [orderId, setOrderId] = React.useState<string | null>(null)

  React.useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(LAST_ORDER_TOTAL_KEY)
      if (stored) setTotal(Number(stored) || 0)
      window.sessionStorage.removeItem(LAST_ORDER_TOTAL_KEY)
    } catch {
      // storage unavailable - fall back to hiding the total
    }
    setOrderId("SER-" + Math.floor(10000 + Math.random() * 89999))
  }, [])

  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-background">
        <Check className="h-7 w-7" />
      </div>
      <DialMark className="mt-6 h-8 w-8 text-brass-dark" />
      <p className="eyebrow mt-4">Order Confirmed</p>
      <h1 className="mt-2 font-display text-4xl">Thank you, your order is on its way</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        A confirmation has been sent to your email. Your order number is{" "}
        <span className="font-mono text-foreground">{orderId ?? "…"}</span>.
      </p>
      {total > 0 && <p className="mt-1 font-mono text-lg">{formatPrice(total)}</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" variant="brass" asChild>
          <Link href="/account/orders">Track Your Order</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
