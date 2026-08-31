import { Badge } from "@/components/ui/badge"
import type { Order } from "@/types"

const styles: Record<Order["status"], string> = {
  Processing: "border-brass text-brass-dark bg-transparent",
  Shipped: "border-ink text-ink bg-transparent",
  "Out for Delivery": "bg-brass text-background border-brass",
  Delivered: "bg-ink text-background border-ink",
  Cancelled: "border-destructive text-destructive bg-transparent",
}

export function StatusBadge({ status }: { status: Order["status"] }) {
  return <Badge className={styles[status]}>{status}</Badge>
}
