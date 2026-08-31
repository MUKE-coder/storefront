import type { Category, Product } from "@/types"
import { img } from "./images"

export const categories: Category[] = [
  {
    id: "cat-chrono",
    slug: "chronograph",
    name: "Chronograph",
    image: img.chrono1,
    description: "Multi-dial precision instruments built for timing what matters — races, dives, flights.",
    children: [
      { id: "cat-chrono-racing", slug: "racing", name: "Racing", image: img.chrono2 },
      { id: "cat-chrono-pilot", slug: "pilot", name: "Pilot", image: img.chrono3 },
      { id: "cat-chrono-field", slug: "field", name: "Field", image: img.chrono1 },
    ],
  },
  {
    id: "cat-automatic",
    slug: "automatic",
    name: "Automatic",
    image: img.automatic1,
    description: "Self-winding movements with visible mechanics — no battery, just craft.",
    children: [
      { id: "cat-auto-skeleton", slug: "skeleton", name: "Skeleton", image: img.automatic2 },
      { id: "cat-auto-classic", slug: "classic", name: "Classic", image: img.automatic3 },
      { id: "cat-auto-gmt", slug: "gmt", name: "GMT", image: img.automatic1 },
    ],
  },
  {
    id: "cat-diver",
    slug: "diver",
    name: "Diver",
    image: img.diver1,
    description: "Water resistant to 200m and beyond, engineered for the deep end.",
    children: [
      { id: "cat-diver-pro", slug: "professional", name: "Professional", image: img.diver2 },
      { id: "cat-diver-vintage", slug: "vintage", name: "Vintage Diver", image: img.diver3 },
      { id: "cat-diver-bronze", slug: "bronze", name: "Bronze", image: img.diver1 },
    ],
  },
  {
    id: "cat-dress",
    slug: "dress",
    name: "Dress",
    image: img.dress1,
    description: "Slim cases and clean dials, cut for the boardroom and beyond.",
    children: [
      { id: "cat-dress-minimal", slug: "minimalist", name: "Minimalist", image: img.dress2 },
      { id: "cat-dress-moon", slug: "moonphase", name: "Moonphase", image: img.dress3 },
      { id: "cat-dress-two-tone", slug: "two-tone", name: "Two-Tone", image: img.dress1 },
    ],
  },
  {
    id: "cat-smart",
    slug: "smart",
    name: "Smart",
    image: img.smart1,
    description: "Analog faces with hidden intelligence — notifications without the screen.",
    children: [
      { id: "cat-smart-hybrid", slug: "hybrid", name: "Hybrid", image: img.smart2 },
      { id: "cat-smart-sport", slug: "sport", name: "Sport", image: img.smart3 },
      { id: "cat-smart-titanium", slug: "titanium", name: "Titanium", image: img.smart1 },
    ],
  },
]

const dialSwatch = {
  black: "#15130f",
  white: "#f2ede1",
  navy: "#1c2b45",
  green: "#243b2c",
  brown: "#4a3625",
  silver: "#c8c6bd",
}

const strapOptions = (imgs: string[]) => [
  { id: "leather-black", label: "Black Leather", swatch: "#1c1712", image: imgs[0], inStock: true, priceDelta: 0 },
  { id: "leather-brown", label: "Cognac Leather", swatch: "#7a4a26", image: imgs[1] ?? imgs[0], inStock: true, priceDelta: 0 },
  { id: "steel", label: "Steel Bracelet", swatch: "#b9bcc0", image: imgs[2] ?? imgs[0], inStock: true, priceDelta: 20 },
  { id: "nylon", label: "Woven Nylon", swatch: "#38507a", image: imgs[0], inStock: false, priceDelta: -10 },
]

function makeProduct(partial: {
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
  badge?: Product["badge"]
  caseSize: string
  rating: number
  reviewCount: number
  description: string
}): Product {
  return {
    ...partial,
    inStock: true,
    highlights: [
      "Sapphire crystal with anti-reflective coating",
      "Swiss-inspired automatic movement, 42h power reserve",
      "316L surgical-grade stainless steel case",
      "Water resistant to 100m",
    ],
    specs: [
      { label: "Case Diameter", value: partial.caseSize },
      { label: "Case Material", value: "316L Stainless Steel" },
      { label: "Movement", value: "Automatic, 21 Jewels" },
      { label: "Crystal", value: "Sapphire, AR-coated" },
      { label: "Water Resistance", value: "100m / 10 ATM" },
      { label: "Warranty", value: "2-year international warranty" },
    ],
    variantGroups: [
      {
        name: "Dial Color",
        key: "dial",
        options: [
          { id: "black", label: "Black", swatch: dialSwatch.black, inStock: true, priceDelta: 0 },
          { id: "white", label: "Ivory", swatch: dialSwatch.white, inStock: true, priceDelta: 0 },
          { id: "navy", label: "Navy", swatch: dialSwatch.navy, inStock: true, priceDelta: 12 },
          { id: "green", label: "Forest", swatch: dialSwatch.green, inStock: false, priceDelta: 12 },
        ],
      },
      {
        name: "Strap",
        key: "strap",
        options: strapOptions(partial.images),
      },
    ],
    reviews: [
      {
        id: `${partial.id}-r1`,
        author: "Marcus T.",
        rating: 5,
        date: "2026-06-14",
        title: "Exceeded expectations",
        body: "The finishing on this piece is far beyond its price point. The bezel action is tight and the lume lasts all night.",
      },
      {
        id: `${partial.id}-r2`,
        author: "Priya K.",
        rating: 4,
        date: "2026-05-02",
        title: "Great everyday watch",
        body: "Comfortable on the wrist and keeps accurate time. Wish the box was a bit sturdier, but the watch itself is excellent.",
      },
      {
        id: `${partial.id}-r3`,
        author: "Daniel O.",
        rating: 5,
        date: "2026-03-22",
        title: "Worth the wait",
        body: "Ordered this after months of research. Sereno really nailed the proportions — it wears smaller than the case size suggests.",
      },
    ],
  }
}

export const products: Product[] = [
  makeProduct({
    id: "p-aurix-chrono",
    slug: "aurix-chrono",
    name: "Aurix Chrono",
    collection: "AX-C120",
    sku: "AX-C120-42MM",
    price: 249,
    compareAtPrice: 498,
    images: [img.chrono1, img.chrono2, img.chrono3, img.heroWatch],
    categoryId: "cat-chrono",
    categorySlug: "chronograph",
    badge: "50% Off",
    caseSize: "42mm",
    rating: 4.7,
    reviewCount: 312,
    description:
      "The Aurix Chrono pairs a tri-register dial with a brushed steel case for a watch that reads as sport and dress in equal measure. Built for the commute, the boardroom, and everything after.",
  }),
  makeProduct({
    id: "p-nova-classic",
    slug: "nova-classic",
    name: "Nova Classic",
    collection: "NV-A98",
    sku: "NV-A98-42MM",
    price: 199,
    images: [img.automatic2, img.automatic1, img.automatic3],
    categoryId: "cat-automatic",
    categorySlug: "automatic",
    badge: "New Arrival",
    caseSize: "42mm",
    rating: 4.5,
    reviewCount: 184,
    description:
      "Nova Classic strips the dial back to three hands and a date window, letting the automatic movement do the talking through an exhibition caseback.",
  }),
  makeProduct({
    id: "p-steel-pro",
    slug: "steel-pro",
    name: "Steel Pro",
    collection: "SP-X55",
    sku: "SP-X55-44MM",
    price: 299,
    compareAtPrice: 598,
    images: [img.diver2, img.diver1, img.diver3, img.heroWatch3],
    categoryId: "cat-diver",
    categorySlug: "diver",
    badge: "50% Off",
    caseSize: "44mm",
    rating: 4.8,
    reviewCount: 501,
    description:
      "Steel Pro is rated to 200m with a unidirectional bezel and a fully lumed dial, engineered for the professional diver and the weekend snorkeler alike.",
  }),
  makeProduct({
    id: "p-steel-pro-copper",
    slug: "steel-pro-copper",
    name: "Steel Pro Copper",
    collection: "SP-X55",
    sku: "SP-X55C-44MM",
    price: 299,
    images: [img.diver3, img.diver2, img.diver1],
    categoryId: "cat-diver",
    categorySlug: "diver",
    badge: "New Arrival",
    caseSize: "44mm",
    rating: 4.6,
    reviewCount: 97,
    description:
      "The Copper edition of Steel Pro trades the standard bracelet for a cognac leather strap, keeping the 200m dive rating intact.",
  }),
  makeProduct({
    id: "p-meridian-dress",
    slug: "meridian-dress",
    name: "Meridian Dress",
    collection: "MD-210",
    sku: "MD-210-38MM",
    price: 279,
    images: [img.dress1, img.dress2, img.dress3],
    categoryId: "cat-dress",
    categorySlug: "dress",
    badge: "Bestseller",
    caseSize: "38mm",
    rating: 4.9,
    reviewCount: 268,
    description:
      "A 38mm case and a domed sapphire crystal give Meridian Dress a low profile that slips easily under a cuff — the definition of understated.",
  }),
  makeProduct({
    id: "p-meridian-moonphase",
    slug: "meridian-moonphase",
    name: "Meridian Moonphase",
    collection: "MD-330",
    sku: "MD-330-40MM",
    price: 349,
    compareAtPrice: 429,
    images: [img.dress3, img.dress1, img.dress2],
    categoryId: "cat-dress",
    categorySlug: "dress",
    caseSize: "40mm",
    rating: 4.7,
    reviewCount: 76,
    description:
      "A moonphase complication rides beneath a sunray dial, tracking the lunar cycle with a hand-finished aperture at six o'clock.",
  }),
  makeProduct({
    id: "p-atlas-titanium",
    slug: "atlas-titanium",
    name: "Atlas Titanium",
    collection: "AT-500",
    sku: "AT-500-44MM",
    price: 389,
    images: [img.smart1, img.smart2, img.smart3],
    categoryId: "cat-smart",
    categorySlug: "smart",
    badge: "Limited",
    caseSize: "44mm",
    rating: 4.4,
    reviewCount: 58,
    description:
      "Atlas Titanium hides seven days of notifications behind a fully analog face, paired with a grade-2 titanium case that weighs almost nothing.",
  }),
  makeProduct({
    id: "p-field-scout",
    slug: "field-scout",
    name: "Field Scout",
    collection: "FS-140",
    sku: "FS-140-40MM",
    price: 219,
    images: [img.chrono3, img.chrono1, img.chrono2],
    categoryId: "cat-chrono",
    categorySlug: "chronograph",
    caseSize: "40mm",
    rating: 4.6,
    reviewCount: 143,
    description:
      "Field Scout takes cues from military-issue chronographs, with a matte dial and oversized numerals built for at-a-glance legibility.",
  }),
  makeProduct({
    id: "p-gmt-voyager",
    slug: "gmt-voyager",
    name: "GMT Voyager",
    collection: "GV-410",
    sku: "GV-410-41MM",
    price: 329,
    images: [img.automatic3, img.automatic1, img.automatic2],
    categoryId: "cat-automatic",
    categorySlug: "automatic",
    badge: "New Arrival",
    caseSize: "41mm",
    rating: 4.8,
    reviewCount: 121,
    description:
      "A fourth hand tracks a second time zone against a two-tone bezel, built for the itinerary that never quite lands in one place.",
  }),
  makeProduct({
    id: "p-bronze-mariner",
    slug: "bronze-mariner",
    name: "Bronze Mariner",
    collection: "BM-600",
    sku: "BM-600-42MM",
    price: 359,
    images: [img.diver1, img.diver3, img.diver2],
    categoryId: "cat-diver",
    categorySlug: "diver",
    caseSize: "42mm",
    rating: 4.5,
    reviewCount: 89,
    description:
      "A CuSn8 bronze case develops a living patina over time, paired with a canvas NATO strap for a watch that ages the way you do.",
  }),
  makeProduct({
    id: "p-skeleton-atelier",
    slug: "skeleton-atelier",
    name: "Skeleton Atelier",
    collection: "SK-880",
    sku: "SK-880-40MM",
    price: 419,
    compareAtPrice: 499,
    images: [img.automatic1, img.automatic3, img.automatic2],
    categoryId: "cat-automatic",
    categorySlug: "automatic",
    badge: "Limited",
    caseSize: "40mm",
    rating: 4.9,
    reviewCount: 44,
    description:
      "Every bridge and gear of the movement is exposed through an open-worked dial, hand-assembled and finished with Geneva stripes.",
  }),
  makeProduct({
    id: "p-hybrid-commuter",
    slug: "hybrid-commuter",
    name: "Hybrid Commuter",
    collection: "HC-220",
    sku: "HC-220-42MM",
    price: 229,
    images: [img.smart2, img.smart1, img.smart3],
    categoryId: "cat-smart",
    categorySlug: "smart",
    caseSize: "42mm",
    rating: 4.3,
    reviewCount: 167,
    description:
      "Hybrid Commuter keeps a fully mechanical movement under the dial while a discreet sub-eye tracks activity and notifications.",
  }),
  makeProduct({
    id: "p-two-tone-regent",
    slug: "two-tone-regent",
    name: "Two-Tone Regent",
    collection: "TR-150",
    sku: "TR-150-36MM",
    price: 269,
    images: [img.dress2, img.dress3, img.dress1],
    categoryId: "cat-dress",
    categorySlug: "dress",
    caseSize: "36mm",
    rating: 4.6,
    reviewCount: 92,
    description:
      "Gold PVD accents trace the bezel and center links of an otherwise steel case, sized for a smaller wrist without losing presence.",
  }),
  makeProduct({
    id: "p-vintage-diver-58",
    slug: "vintage-diver-58",
    name: "Vintage Diver '58",
    collection: "VD-058",
    sku: "VD-058-40MM",
    price: 289,
    images: [img.diver2, img.diver1, img.diver3],
    categoryId: "cat-diver",
    categorySlug: "diver",
    badge: "Bestseller",
    caseSize: "40mm",
    rating: 4.8,
    reviewCount: 234,
    description:
      "A faithful reissue of a 1958 dive watch, down to the domed acrylic-style crystal and faded lume plots.",
  }),
]

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug)
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, limit)
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((p) => p.categorySlug === categorySlug)
}
