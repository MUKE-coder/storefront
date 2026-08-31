import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryBySlug } from "@/data/catalog"
import { CategoryView } from "./category-view"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  return { title: `${category.name} — Sereno`, description: category.description }
}

/**
 * The sub-collection refinement lives in the query string, so it is resolved
 * here rather than with useSearchParams - that keeps the product grid in the
 * server-rendered HTML.
 */
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ collection?: string }>
}) {
  const { slug } = await params
  const { collection } = await searchParams
  if (!getCategoryBySlug(slug)) notFound()
  return <CategoryView slug={slug} activeChild={collection ?? null} />
}
