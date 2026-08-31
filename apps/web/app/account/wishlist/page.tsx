import { ProductCard } from "@/components/shared/product-card"
import { products } from "@/data/catalog"

export default function WishlistPage() {
  const wishlist = products.slice(4, 7)

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl">Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="border border-dashed border-border py-16 text-center">
          <p className="font-display text-lg">Nothing saved yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Tap the heart on any watch to save it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {wishlist.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
