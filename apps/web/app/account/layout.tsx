"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, Package, MapPin, User, Heart, LogOut } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { currentCustomer } from "@/data/account"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Overview", to: "/account", icon: LayoutGrid, end: true },
  { label: "Orders", to: "/account/orders", icon: Package },
  { label: "Addresses", to: "/account/addresses", icon: MapPin },
  { label: "Wishlist", to: "/account/wishlist", icon: Heart },
  { label: "Profile Settings", to: "/account/profile", icon: User },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div className="container py-12">
      <div className="mb-10 flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={currentCustomer.avatar} alt={currentCustomer.firstName} />
          <AvatarFallback>{currentCustomer.firstName[0]}{currentCustomer.lastName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="eyebrow">{currentCustomer.loyaltyTier} Member</p>
          <h1 className="font-display text-2xl">
            {currentCustomer.firstName} {currentCustomer.lastName}
          </h1>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside>
          <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:gap-0.5 lg:overflow-visible">
            {navItems.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  "flex shrink-0 items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                  isActive(item.to, item.end) ? "bg-ink text-background" : "text-foreground/70 hover:bg-secondary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <button className="mt-2 hidden items-center gap-3 px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:text-destructive lg:flex">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </nav>
        </aside>
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}
