export interface ProductVariant {
  id: string
  label: string // e.g. dial color, band material
  swatch?: string // hex color for swatch
  image?: string
  priceDelta?: number
  inStock: boolean
}

export interface ProductReview {
  id: string
  author: string
  rating: number
  date: string
  title: string
  body: string
}

export interface Product {
  id: string
  slug: string
  name: string
  collection: string
  sku: string
  price: number
  compareAtPrice?: number
  images: string[]
  categoryId: string
  categorySlug: string
  description: string
  highlights: string[]
  specs: { label: string; value: string }[]
  variantGroups: {
    name: string
    key: string
    options: ProductVariant[]
  }[]
  rating: number
  reviewCount: number
  reviews: ProductReview[]
  badge?: "New Arrival" | "50% Off" | "Bestseller" | "Limited"
  caseSize: string
  inStock: boolean
}

export interface Category {
  id: string
  slug: string
  name: string
  image: string
  description: string
  children: { id: string; slug: string; name: string; image: string }[]
}

export interface CartLine {
  productId: string
  variantSelection: Record<string, string>
  quantity: number
}

export interface Address {
  id: string
  fullName: string
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  isDefault?: boolean
}

export interface Order {
  id: string
  date: string
  status: "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled"
  total: number
  eta?: string
  trackingSteps: { label: string; done: boolean; date?: string }[]
  items: { productId: string; name: string; image: string; variant: string; quantity: number; price: number }[]
  shippingAddress: Address
}
