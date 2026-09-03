'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react'
import { useStoreValue } from '@simplestack/store/react'
import { DialMark } from '@/components/shared/dial-mark'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useHydrated } from '@/hooks/use-hydrated'
import { cartItemsStore, cartOpenStore, cartItemCount } from '@/stores/cart-store'
import { categories, products } from '@/data/catalog'
import { CategoryScrollBar } from './category-scroll-bar'

const primaryNav = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'Account', to: '/account' },
]

export function Header() {
  const hydrated = useHydrated()
  const itemCount = useStoreValue(cartItemsStore, cartItemCount) ?? 0
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const router = useRouter()
  const pathname = usePathname()

  // NavLink's isActive, ported: exact match for "/", prefix match elsewhere.
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  const results = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : []

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    if (results[0]) {
      router.push(`/products/${results[0].slug}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  return (
    <header className="border-border bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="border-border/70 bg-ink text-background/80 border-b py-2 text-center text-[11px] tracking-[0.2em] uppercase">
        Free worldwide shipping on orders over $200 · 2-year warranty on every watch
      </div>
      <div className="container flex h-20 items-center justify-between gap-4">
        <button className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/" className="flex items-center gap-2">
          <DialMark className="text-ink h-7 w-7" />
          <span className="font-display text-xl tracking-tight">Sereno</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                'text-foreground/70 hover:text-foreground text-sm font-medium tracking-wide transition-colors',
                isActive(item.to) && 'text-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div className="relative hidden sm:block">
            <button
              className="text-foreground/80 hover:text-foreground flex h-10 w-10 items-center justify-center"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            {searchOpen && (
              <form
                onSubmit={submitSearch}
                className="border-border bg-popover animate-fade-in absolute top-12 right-0 w-80 rounded-xl border p-3 shadow-lg"
              >
                <Input
                  autoFocus
                  placeholder="Search watches…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-10 rounded-full"
                />
                {results.length > 0 && (
                  <ul className="divide-border mt-2 divide-y">
                    {results.map((r) => (
                      <li key={r.id}>
                        <Link
                          href={`/products/${r.slug}`}
                          onClick={() => {
                            setSearchOpen(false)
                            setQuery('')
                          }}
                          className="hover:text-foreground flex items-center gap-3 py-2 text-sm"
                        >
                          <img
                            src={r.images[0]}
                            className="h-10 w-10 rounded-lg object-cover"
                            alt=""
                          />
                          <span>{r.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </form>
            )}
          </div>
          <Link
            href="/account"
            className="text-foreground/80 hover:text-foreground hidden h-10 w-10 items-center justify-center sm:flex"
            aria-label="Account"
          >
            <User className="h-[18px] w-[18px]" />
          </Link>
          <button
            className="text-foreground/80 hover:text-foreground relative flex h-10 w-10 items-center justify-center"
            onClick={() => cartOpenStore.set(true)}
            aria-label="Open cart"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {hydrated && itemCount > 0 && (
              <span className="bg-ink text-background absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Reads search params to highlight the active chip, so it needs its own
          boundary or every static page bails out of prerendering. */}
      <React.Suspense fallback={<div className="border-border bg-background h-[49px] border-b" />}>
        <CategoryScrollBar />
      </React.Suspense>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="bg-ink/50 absolute inset-0" onClick={() => setMobileOpen(false)} />
          <div className="bg-background animate-fade-in relative ml-auto flex h-full w-72 flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {primaryNav.map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-border mt-2 border-t pt-4">
              <p className="eyebrow mb-2">Shop by category</p>
              <div className="flex flex-col gap-2">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/categories/${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="text-foreground/70 text-sm"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
