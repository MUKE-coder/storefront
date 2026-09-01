/**
 * Loading skeletons, one per data-fetching surface.
 *
 * Each mirrors the container, grid tracks and block sizes of the real page so
 * swapping in the loaded content does not shift layout. Shapes are built from
 * `@/components/ui/skeleton`, which paints with `bg-secondary` and therefore
 * follows the active theme.
 *
 * Use them either as a Next.js `loading.tsx` (server-rendered, streamed) or
 * behind a client `isLoading` flag from React Query.
 */

export { SkeletonShell } from "./skeleton-shell"

// Building blocks
export { ProductCardSkeleton } from "./product-card-skeleton"
export { ProductGridSkeleton } from "./product-grid-skeleton"

// Home
export {
  HomeSkeleton,
  HeroSkeleton,
  CategoryTileGridSkeleton,
  SectionHeadingSkeleton,
} from "./home-skeleton"

// Shop + categories
export { ShopSkeleton, ShopFiltersSkeleton } from "./shop-skeleton"
export { CategoriesSkeleton, CategoryDetailSkeleton } from "./categories-skeleton"

// Product detail
export { ProductDetailSkeleton } from "./product-detail-skeleton"

// Cart + checkout
export { CartSkeleton, OrderSummarySkeleton } from "./cart-skeleton"
export { CheckoutSkeleton, OrderConfirmationSkeleton } from "./checkout-skeleton"

// Blog
export {
  BlogListSkeleton,
  BlogCardGridSkeleton,
  BlogDetailSkeleton,
} from "./blog-skeleton"

// Account
export {
  AccountLayoutSkeleton,
  AccountOverviewSkeleton,
  AccountOrdersSkeleton,
  OrderDetailSkeleton,
  AccountProfileSkeleton,
  AccountAddressesSkeleton,
  AccountWishlistSkeleton,
} from "./account-skeleton"
