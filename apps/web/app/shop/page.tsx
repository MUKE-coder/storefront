import type { Metadata } from "next"
import { ShopView } from "./shop-view"

export const metadata: Metadata = {
  title: "Shop All Watches — Sereno",
  description: "Browse the full Sereno collection of precision timepieces.",
}

/**
 * Category filters live in the query string, so this page resolves them on the
 * server and hands the result to the client view. That keeps the product grid
 * in the server-rendered HTML instead of bailing out to a blank client shell.
 */
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>
}) {
  const { category } = await searchParams
  const activeCategories = category ? (Array.isArray(category) ? category : [category]) : []
  return <ShopView activeCategories={activeCategories} />
}
