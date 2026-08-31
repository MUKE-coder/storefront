import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductBySlug, products } from "@/data/catalog"
import { ProductView } from "./product-view"

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.name} — Sereno`,
    description: product.description,
    openGraph: { images: product.images.slice(0, 1) },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!getProductBySlug(slug)) notFound()
  return <ProductView />
}
