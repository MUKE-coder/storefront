'use client'

import { usePathname } from 'next/navigation'

import { Header } from './layout/header'
import { CartDrawer } from './layout/cart-drawer'
import { Footer } from './layout/footer'

const CHROMELESS_PREFIXES = ['/forms/']

export function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
