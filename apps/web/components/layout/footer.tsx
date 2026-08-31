'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import { DialMark } from '@/components/shared/dial-mark'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { categories } from '@/data/catalog'
import { newsletterSchema, type NewsletterValues } from '@/lib/checkout-schemas'

export function Footer() {
  const form = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  })

  function onSubmit() {
    form.reset()
  }

  return (
    <footer className="border-border text-background border-t bg-black">
      <div className="container grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <DialMark className="h-7 w-7" />
            <span className="font-display text-xl">Sereno</span>
          </Link>
          <p className="text-background/60 max-w-xs text-sm">
            Watches crafted with precision, premium materials, and designs that last a lifetime.
          </p>
        </div>

        <div>
          <p className="eyebrow text-background/50 mb-4">Shop</p>
          <ul className="text-background/70 space-y-2.5 text-sm">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="hover:text-background transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-background/50 mb-4">Company</p>
          <ul className="text-background/70 space-y-2.5 text-sm">
            <li>
              <Link href="/account" className="hover:text-background transition-colors">
                Account
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-background transition-colors">
                Track Order
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-background transition-colors">
                All Watches
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-background transition-colors">
                Your Bag
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-background/50 mb-4">Stay in the loop</p>
          <p className="text-background/60 mb-3 text-sm">
            New arrivals and private sales, once a month at most.
          </p>
          <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <div className="flex gap-2">
              <Input
                placeholder="you@email.com"
                aria-invalid={!!form.formState.errors.email}
                className="border-background/20 text-background placeholder:text-background/40 rounded-full bg-transparent"
                {...form.register('email')}
              />
              <Button variant="brass" size="default" type="submit">
                {form.formState.isSubmitSuccessful ? <Check className="h-4 w-4" /> : 'Join'}
              </Button>
            </div>
            {form.formState.errors.email && (
              <p className="text-xs text-red-300">{form.formState.errors.email.message}</p>
            )}
          </form>
        </div>
      </div>
      <div className="border-background/10 border-t py-6">
        <div className="text-background/40 container flex flex-col items-center justify-between gap-3 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} Sereno Watch Co. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
