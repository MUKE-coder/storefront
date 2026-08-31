import { store } from "@simplestack/store"

/**
 * Cart state powered by Simple Store (@simplestack/store).
 * See: https://simple-stack.dev/store
 *
 * Each line item carries its own resolved unit price (base price + any
 * variant price deltas), computed once at add-to-cart time, exactly like
 * the "Shopping Cart" example in the Simple Store guide.
 */
export type CartLineItem = {
  id: string // productId + variant signature, uniquely identifies a line
  productId: string
  slug: string
  name: string
  image: string
  price: number
  quantity: number
  variantLabel: string
  variantSelection: Record<string, string>
}

type CartState = {
  items: CartLineItem[]
}

const STORAGE_KEY = "sereno-cart-v2"

/**
 * The App Router has no equivalent of React Router's location state, so the
 * checkout hands the placed-order total to the confirmation screen here.
 */
export const LAST_ORDER_TOTAL_KEY = "sereno-last-order-total"

function loadInitial(): CartState {
  if (typeof window === "undefined") return { items: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as CartState
  } catch {
    // ignore corrupt storage
  }
  return { items: [] }
}

export const cartStore = store<CartState>(loadInitial())

// Granular sub-store so components only re-render on item changes.
export const cartItemsStore = cartStore.select("items")

// Whether the slide-out cart drawer is open.
export const cartOpenStore = store(false)

// Persist to localStorage on every change (Simple Store "Persistence" pattern).
cartStore.subscribe((state) => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable (private mode, quota, etc.) - fail silently
  }
})

export function lineId(productId: string, variantSelection: Record<string, string>) {
  return (
    productId +
    "::" +
    Object.entries(variantSelection)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join(",")
  )
}

export function addToCart(item: Omit<CartLineItem, "quantity">, quantity = 1) {
  const items = cartItemsStore.get()
  const existing = items.find((i) => i.id === item.id)

  const next = existing
    ? items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i))
    : [...items, { ...item, quantity }]

  cartItemsStore.set(next)
  cartOpenStore.set(true)
}

export function removeFromCart(id: string) {
  cartItemsStore.set(cartItemsStore.get().filter((i) => i.id !== id))
}

export function updateQuantity(id: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(id)
    return
  }
  cartItemsStore.set(cartItemsStore.get().map((i) => (i.id === id ? { ...i, quantity } : i)))
}

export function clearCart() {
  cartItemsStore.set([])
}

export function cartSubtotal(items: CartLineItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function cartItemCount(items: CartLineItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
