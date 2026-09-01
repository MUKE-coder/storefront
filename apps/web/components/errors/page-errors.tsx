"use client"

import Link from "next/link"
import {
  PackageX,
  LayoutGrid,
  ShoppingBag,
  CreditCard,
  Receipt,
  Newspaper,
  UserRound,
  MapPin,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ErrorState, type ErrorStateProps } from "./error-state"

/**
 * Whole-page failures — for when the page's primary fetch is the one that
 * died and there is nothing else worth drawing. Sections that merely sit
 * alongside other content should use the section errors instead.
 */

type PageErrorProps = Omit<ErrorStateProps, "size" | "icon">

const backToShop = (
  <Button variant="ghost" size="sm" asChild>
    <Link href="/shop">Browse the shop</Link>
  </Button>
)

const backToAccount = (
  <Button variant="ghost" size="sm" asChild>
    <Link href="/account">Account overview</Link>
  </Button>
)

/** /shop */
export function ShopError(props: PageErrorProps) {
  return (
    <div className="container py-12">
      <ErrorState
        size="page"
        icon={PackageX}
        title="The collection could not be loaded"
        description="We could not reach the catalogue. Try again, or come back in a moment."
        action={backToShop}
        {...props}
      />
    </div>
  )
}

/** /categories */
export function CategoriesError(props: PageErrorProps) {
  return (
    <div className="container py-14">
      <ErrorState
        size="page"
        icon={LayoutGrid}
        title="Collections could not be loaded"
        description="We could not reach the collection list. Try again in a moment."
        action={backToShop}
        {...props}
      />
    </div>
  )
}

/** /categories/[slug] */
export function CategoryDetailError(props: PageErrorProps) {
  return (
    <div className="container py-14">
      <ErrorState
        size="page"
        icon={LayoutGrid}
        title="This collection could not be loaded"
        description="We could not reach it just now. It may also have been renamed or retired."
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/categories">All collections</Link>
          </Button>
        }
        {...props}
      />
    </div>
  )
}

/** /products/[slug] */
export function ProductDetailError(props: PageErrorProps) {
  return (
    <div className="container py-12">
      <ErrorState
        size="page"
        icon={PackageX}
        title="This watch could not be loaded"
        description="We could not reach the product just now. It may also be sold out and withdrawn."
        action={backToShop}
        {...props}
      />
    </div>
  )
}

/** /cart */
export function CartError(props: PageErrorProps) {
  return (
    <div className="container py-12">
      <ErrorState
        size="page"
        icon={ShoppingBag}
        title="Your bag could not be loaded"
        description="We could not read your bag just now. Nothing has been lost — try again."
        action={backToShop}
        {...props}
      />
    </div>
  )
}

/** /checkout — deliberately blunt: money is involved, so say nothing was charged. */
export function CheckoutError(props: PageErrorProps) {
  return (
    <div className="container py-12">
      <ErrorState
        size="page"
        icon={CreditCard}
        title="Checkout could not be loaded"
        description="You have not been charged. Try again, or return to your bag and start over."
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cart">Back to bag</Link>
          </Button>
        }
        {...props}
      />
    </div>
  )
}

/** /order-confirmation */
export function OrderConfirmationError(props: PageErrorProps) {
  return (
    <div className="container py-16">
      <ErrorState
        size="page"
        icon={Receipt}
        title="We could not load your confirmation"
        description="Your order may still have gone through. Check your order history before ordering again."
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/account/orders">View order history</Link>
          </Button>
        }
        {...props}
      />
    </div>
  )
}

/** /blog */
export function BlogListError(props: PageErrorProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <ErrorState
        size="page"
        icon={Newspaper}
        title="The journal could not be loaded"
        description="We could not reach our posts just now. Try again in a moment."
        {...props}
      />
    </div>
  )
}

/** /blog/[slug] */
export function BlogDetailError(props: PageErrorProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <ErrorState
        size="page"
        icon={Newspaper}
        title="This post could not be loaded"
        description="We could not reach it just now. It may also have been unpublished."
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog">All posts</Link>
          </Button>
        }
        {...props}
      />
    </div>
  )
}

/** /account */
export function AccountOverviewError(props: PageErrorProps) {
  return (
    <ErrorState
      size="page"
      icon={UserRound}
      title="Your account could not be loaded"
      description="We could not reach your details just now. Try again in a moment."
      {...props}
    />
  )
}

/** /account/orders */
export function AccountOrdersError(props: PageErrorProps) {
  return (
    <ErrorState
      size="page"
      icon={Receipt}
      title="Order history could not be loaded"
      description="We could not reach your orders just now. Try again in a moment."
      action={backToAccount}
      {...props}
    />
  )
}

/** /account/orders/[orderId] */
export function OrderDetailError(props: PageErrorProps) {
  return (
    <ErrorState
      size="page"
      icon={Receipt}
      title="This order could not be loaded"
      description="We could not reach it just now. Try again, or open it from your order history."
      action={
        <Button variant="ghost" size="sm" asChild>
          <Link href="/account/orders">Order history</Link>
        </Button>
      }
      {...props}
    />
  )
}

/** /account/profile */
export function AccountProfileError(props: PageErrorProps) {
  return (
    <ErrorState
      size="page"
      icon={UserRound}
      title="Profile settings could not be loaded"
      description="We could not reach your details just now. Nothing has been changed."
      action={backToAccount}
      {...props}
    />
  )
}

/** /account/addresses */
export function AccountAddressesError(props: PageErrorProps) {
  return (
    <ErrorState
      size="page"
      icon={MapPin}
      title="Saved addresses could not be loaded"
      description="We could not reach your address book just now. Try again in a moment."
      action={backToAccount}
      {...props}
    />
  )
}

/** /account/wishlist */
export function AccountWishlistError(props: PageErrorProps) {
  return (
    <ErrorState
      size="page"
      icon={Heart}
      title="Your wishlist could not be loaded"
      description="We could not reach your saved watches just now. Try again in a moment."
      action={backToShop}
      {...props}
    />
  )
}
