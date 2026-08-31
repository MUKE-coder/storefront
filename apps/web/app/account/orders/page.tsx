"use client"

import * as React from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { orders } from "@/data/account"
import { formatPrice } from "@/lib/utils"
import { StatusBadge } from "@/components/shared/status-badge"
import type { Order } from "@/types"

export default function OrdersPage() {
  const [filter, setFilter] = React.useState<Order["status"] | "all">("all")
  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl">Order History</h2>
        <Select value={filter} onValueChange={(v) => setFilter(v as Order["status"] | "all")}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((order) => (
              <TableRow key={order.id} className="cursor-pointer">
                <TableCell>
                  <Link href={`/account/orders/${order.id}`} className="font-mono text-sm hover:text-brass-dark">
                    {order.id}
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                <TableCell><StatusBadge status={order.status} /></TableCell>
                <TableCell className="text-sm text-muted-foreground">{order.items.length} item{order.items.length > 1 ? "s" : ""}</TableCell>
                <TableCell className="text-right font-mono text-sm">{formatPrice(order.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {visible.length === 0 && (
          <p className="p-10 text-center text-sm text-muted-foreground">No orders match this status.</p>
        )}
      </div>
    </div>
  )
}
