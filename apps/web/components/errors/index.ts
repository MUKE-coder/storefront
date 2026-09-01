/**
 * Error states, the mirror image of `@/components/skeletons`.
 *
 * Every fetch gets a pair: a skeleton while it is in flight, an error state if
 * it fails. Pick the two from the same altitude — a section skeleton pairs
 * with a section error, so a failed strip keeps the footprint the skeleton
 * held and the page around it does not reflow.
 *
 * Wire `onRetry` to the query's `refetch`. `@/components/query-boundary` does
 * that pairing for you.
 */

export { ErrorState, errorMessage } from "./error-state"
export type { ErrorStateProps, ErrorStateSize, ErrorStateTone } from "./error-state"

// Section-scoped: one strip of a page failed, the rest still renders.
export {
  SectionError,
  HeroError,
  ProductGridError,
  CategoryGridError,
  SummaryError,
  BlogGridError,
} from "./section-errors"

// Page-scoped: the page's primary fetch failed and there is nothing else to draw.
export {
  ShopError,
  CategoriesError,
  CategoryDetailError,
  ProductDetailError,
  CartError,
  CheckoutError,
  OrderConfirmationError,
  BlogListError,
  BlogDetailError,
  AccountOverviewError,
  AccountOrdersError,
  OrderDetailError,
  AccountProfileError,
  AccountAddressesError,
  AccountWishlistError,
} from "./page-errors"
