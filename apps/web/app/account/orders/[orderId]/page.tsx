import { notFound } from "next/navigation"
import { orders } from "@/data/account"
import { OrderDetailView } from "./order-detail-view"

export function generateStaticParams() {
  return orders.map((order) => ({ orderId: order.id }))
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  if (!orders.some((order) => order.id === orderId)) notFound()
  return <OrderDetailView />
}
