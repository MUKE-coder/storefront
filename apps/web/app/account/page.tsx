import Link from "next/link"
import { ArrowRight, Package, MapPin, Heart } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { currentCustomer, orders, addresses } from "@/data/account"
import { products } from "@/data/catalog"
import { formatPrice } from "@/lib/utils"
import { StatusBadge } from "@/components/shared/status-badge"

export default function AccountOverviewPage() {
  const recentOrders = orders.slice(0, 2)
  const wishlist = products.slice(4, 7)

  return (
    <div className="space-y-10">
      {/* Loyalty */}
      <div className="rounded-2xl border border-border p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow mb-1">Loyalty Status</p>
            <h2 className="font-display text-2xl">{currentCustomer.loyaltyTier}</h2>
          </div>
          <p className="font-mono text-sm text-muted-foreground">
            {currentCustomer.loyaltyPoints} / {currentCustomer.nextTierPoints} pts to Gold Circle
          </p>
        </div>
        <Progress value={(currentCustomer.loyaltyPoints / currentCustomer.nextTierPoints) * 100} className="mt-4" />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/account/orders" className="group flex flex-col gap-3 rounded-2xl border border-border p-6 transition-colors hover:border-ink/40">
          <Package className="h-5 w-5 text-brass-dark" />
          <p className="font-display text-2xl">{orders.length}</p>
          <p className="text-sm text-muted-foreground">Orders placed</p>
        </Link>
        <Link href="/account/addresses" className="group flex flex-col gap-3 rounded-2xl border border-border p-6 transition-colors hover:border-ink/40">
          <MapPin className="h-5 w-5 text-brass-dark" />
          <p className="font-display text-2xl">{addresses.length}</p>
          <p className="text-sm text-muted-foreground">Saved addresses</p>
        </Link>
        <Link href="/account/wishlist" className="group flex flex-col gap-3 rounded-2xl border border-border p-6 transition-colors hover:border-ink/40">
          <Heart className="h-5 w-5 text-brass-dark" />
          <p className="font-display text-2xl">{wishlist.length}</p>
          <p className="text-sm text-muted-foreground">Wishlist items</p>
        </Link>
      </div>

      {/* Recent orders */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl">Recent Orders</h2>
          <Button variant="link" asChild className="h-auto p-0">
            <Link href="/account/orders">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {recentOrders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`} className="flex flex-wrap items-center justify-between gap-3 py-4 transition-colors hover:bg-secondary/40">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item) => (
                    <img key={item.productId} src={item.image} alt="" className="h-12 w-12 border-2 border-background object-cover" />
                  ))}
                </div>
                <div>
                  <p className="font-mono text-sm">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
              </div>
              <StatusBadge status={order.status} />
              <span className="font-mono text-sm">{formatPrice(order.total)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
