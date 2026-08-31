"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { orders } from "@/data/account"
import { formatPrice, cn } from "@/lib/utils"
import { StatusBadge } from "@/components/shared/status-badge"

export function OrderDetailView() {
  const { orderId } = useParams<{ orderId: string }>()
  const order = orders.find((o) => o.id === orderId)

  if (!order) return null

  const subtotal = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div>
      <Link href="/account/orders" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Order</p>
          <h2 className="font-mono text-2xl">{order.id}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Placed on {order.date}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Tracking timeline - dial motif: steps arranged like hour markers */}
      {order.status !== "Cancelled" && (
        <div className="mb-10 rounded-2xl border border-border p-6">
          {order.eta && <p className="mb-6 font-display text-lg">{order.eta}</p>}
          <div className="flex items-center">
            {order.trackingSteps.map((step, i) => (
              <div key={step.label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border font-mono text-[10px]",
                      step.done ? "border-ink bg-ink text-background" : "border-border text-muted-foreground"
                    )}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p className={cn("text-xs", step.done ? "text-foreground" : "text-muted-foreground")}>{step.label}</p>
                    {step.date && <p className="text-[10px] text-muted-foreground">{step.date}</p>}
                  </div>
                </div>
                {i < order.trackingSteps.length - 1 && (
                  <div className={cn("mx-2 h-px flex-1 translate-y-[-14px]", step.done ? "bg-ink" : "bg-border")} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h3 className="mb-4 font-display text-lg">Items</h3>
          <div className="divide-y divide-border border-y border-border">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 py-4">
                <img src={item.image} alt={item.name} className="h-16 w-16 object-cover" />
                <div className="flex-1">
                  <Link href={`/products`} className="font-medium">{item.name}</Link>
                  <p className="text-xs text-muted-foreground">{item.variant}</p>
                  <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                </div>
                <span className="font-mono text-sm">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="outline">Buy Again</Button>
          </div>
        </div>

        <div className="h-fit space-y-6">
          <div className="rounded-2xl border border-border p-5">
            <div className="mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brass-dark" />
              <h3 className="font-display text-base">Shipping Address</h3>
            </div>
            <p className="text-sm">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-muted-foreground">{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && <p className="text-sm text-muted-foreground">{order.shippingAddress.line2}</p>}
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </p>
          </div>

          <div className="rounded-2xl border border-border p-5">
            <h3 className="mb-3 font-display text-base">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-mono">{subtotal >= 200 ? "Free" : formatPrice(15)}</span></div>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-display text-lg"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
