import type { Address, Order } from "@/types"
import { img } from "./images"

export const currentCustomer = {
  firstName: "Amara",
  lastName: "Whitfield",
  email: "amara.whitfield@example.com",
  phone: "+1 (555) 019-2231",
  avatar: img.avatar1,
  memberSince: "2023",
  loyaltyTier: "Brass Circle",
  loyaltyPoints: 1280,
  nextTierPoints: 2000,
}

export const addresses: Address[] = [
  {
    id: "addr-1",
    fullName: "Amara Whitfield",
    line1: "482 Halden Street",
    line2: "Unit 3B",
    city: "Portland",
    state: "OR",
    zip: "97205",
    country: "United States",
    phone: "+1 (555) 019-2231",
    isDefault: true,
  },
  {
    id: "addr-2",
    fullName: "Amara Whitfield",
    line1: "1220 Corbett Ave",
    city: "San Francisco",
    state: "CA",
    zip: "94131",
    country: "United States",
    phone: "+1 (555) 019-2231",
  },
]

export const orders: Order[] = [
  {
    id: "SER-10482",
    date: "2026-08-18",
    status: "Out for Delivery",
    total: 299,
    eta: "Arrives Aug 31",
    trackingSteps: [
      { label: "Order placed", done: true, date: "Aug 18" },
      { label: "Processed", done: true, date: "Aug 19" },
      { label: "Shipped", done: true, date: "Aug 21" },
      { label: "Out for delivery", done: true, date: "Aug 29" },
      { label: "Delivered", done: false },
    ],
    items: [
      { productId: "p-steel-pro", name: "Steel Pro", image: img.diver2, variant: "Black / Steel Bracelet", quantity: 1, price: 299 },
    ],
    shippingAddress: addresses[0],
  },
  {
    id: "SER-10311",
    date: "2026-07-02",
    status: "Delivered",
    total: 448,
    trackingSteps: [
      { label: "Order placed", done: true, date: "Jul 2" },
      { label: "Processed", done: true, date: "Jul 3" },
      { label: "Shipped", done: true, date: "Jul 4" },
      { label: "Out for delivery", done: true, date: "Jul 7" },
      { label: "Delivered", done: true, date: "Jul 7" },
    ],
    items: [
      { productId: "p-aurix-chrono", name: "Aurix Chrono", image: img.chrono1, variant: "Navy / Cognac Leather", quantity: 1, price: 249 },
      { productId: "p-nova-classic", name: "Nova Classic", image: img.automatic2, variant: "Ivory / Steel Bracelet", quantity: 1, price: 199 },
    ],
    shippingAddress: addresses[0],
  },
  {
    id: "SER-09876",
    date: "2026-05-11",
    status: "Delivered",
    total: 279,
    trackingSteps: [
      { label: "Order placed", done: true, date: "May 11" },
      { label: "Processed", done: true, date: "May 12" },
      { label: "Shipped", done: true, date: "May 13" },
      { label: "Out for delivery", done: true, date: "May 15" },
      { label: "Delivered", done: true, date: "May 15" },
    ],
    items: [
      { productId: "p-meridian-dress", name: "Meridian Dress", image: img.dress1, variant: "Black / Black Leather", quantity: 1, price: 279 },
    ],
    shippingAddress: addresses[1],
  },
  {
    id: "SER-09410",
    date: "2026-02-27",
    status: "Cancelled",
    total: 359,
    trackingSteps: [
      { label: "Order placed", done: true, date: "Feb 27" },
      { label: "Cancelled", done: true, date: "Feb 28" },
    ],
    items: [
      { productId: "p-bronze-mariner", name: "Bronze Mariner", image: img.diver1, variant: "Black / Woven Nylon", quantity: 1, price: 359 },
    ],
    shippingAddress: addresses[0],
  },
]
