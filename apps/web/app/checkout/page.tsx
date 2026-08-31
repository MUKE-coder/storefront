"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useStoreValue } from "@simplestack/store/react"
import { Check, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { FormField } from "@/components/shared/form-field"
import { cartItemsStore, cartSubtotal, clearCart, LAST_ORDER_TOTAL_KEY } from "@/stores/cart-store"
import { useHydrated } from "@/hooks/use-hydrated"
import { shippingSchema, cardSchema, type ShippingValues, type CardValues } from "@/lib/checkout-schemas"
import { cn, formatPrice } from "@/lib/utils"

const steps = ["Shipping", "Delivery", "Payment", "Review"] as const
type Step = (typeof steps)[number]

export default function CheckoutPage() {
  const items = useStoreValue(cartItemsStore) ?? []
  const subtotal = cartSubtotal(items)
  const router = useRouter()
  const hydrated = useHydrated()
  const [orderPlaced, setOrderPlaced] = React.useState(false)
  const [stepIndex, setStepIndex] = React.useState(0)
  const [shippingMethod, setShippingMethod] = React.useState("standard")
  const [paymentMethod, setPaymentMethod] = React.useState("card")
  const [placing, setPlacing] = React.useState(false)
  const [shippingValues, setShippingValues] = React.useState<ShippingValues | null>(null)

  const shippingForm = useForm<ShippingValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
    },
  })

  const cardForm = useForm<CardValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: { cardNumber: "", expiry: "", cvc: "", nameOnCard: "" },
  })

  const cartIsEmpty = items.length === 0

  React.useEffect(() => {
    if (hydrated && cartIsEmpty && !orderPlaced) router.replace("/cart")
  }, [hydrated, cartIsEmpty, orderPlaced, router])

  if (!hydrated || (cartIsEmpty && !orderPlaced)) {
    return (
      <div className="container flex min-h-[50vh] items-center justify-center py-24">
        <p className="text-sm text-muted-foreground">Loading your bag…</p>
      </div>
    )
  }

  const step: Step = steps[stepIndex]
  const shippingCost = shippingMethod === "express" ? 25 : subtotal >= 200 ? 0 : 15
  const tax = Math.round(subtotal * 0.08)
  const total = subtotal + shippingCost + tax

  function goTo(i: number) {
    setStepIndex(i)
  }
  function back() {
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  function onSubmitShipping(values: ShippingValues) {
    setShippingValues(values)
    goTo(1)
  }

  function onSubmitPayment() {
    if (paymentMethod !== "card") {
      goTo(3)
      return
    }
    cardForm.handleSubmit(() => goTo(3))()
  }

  function placeOrder() {
    setPlacing(true)
    setTimeout(() => {
      try {
        window.sessionStorage.setItem(LAST_ORDER_TOTAL_KEY, String(total))
      } catch {
        // storage unavailable - the confirmation screen just omits the total
      }
      setOrderPlaced(true)
      clearCart()
      router.push("/order-confirmation")
    }, 900)
  }

  return (
    <div className="container py-12">
      <div className="mb-10 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl">Sereno</Link>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" /> Secure Checkout
        </div>
      </div>

      {/* Step indicator - dial motif */}
      <div className="mb-12 flex items-center">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border font-mono text-xs transition-colors",
                  i < stepIndex && "border-ink bg-ink text-background",
                  i === stepIndex && "border-ink text-ink",
                  i > stepIndex && "border-border text-muted-foreground"
                )}
              >
                {i < stepIndex ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("hidden text-xs sm:block", i === stepIndex ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={cn("mx-2 h-px flex-1", i < stepIndex ? "bg-ink" : "bg-border")} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          {step === "Shipping" && (
            <form onSubmit={shippingForm.handleSubmit(onSubmitShipping)} className="space-y-6 animate-fade-in" noValidate>
              <h2 className="font-display text-2xl">Shipping Address</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="First Name" placeholder="Amara" error={shippingForm.formState.errors.firstName} {...shippingForm.register("firstName")} />
                <FormField label="Last Name" placeholder="Whitfield" error={shippingForm.formState.errors.lastName} {...shippingForm.register("lastName")} />
                <FormField label="Email" placeholder="you@email.com" containerClassName="sm:col-span-2" error={shippingForm.formState.errors.email} {...shippingForm.register("email")} />
                <FormField label="Address" placeholder="482 Halden Street" containerClassName="sm:col-span-2" error={shippingForm.formState.errors.address} {...shippingForm.register("address")} />
                <FormField label="Apt / Suite (optional)" placeholder="Unit 3B" containerClassName="sm:col-span-2" error={shippingForm.formState.errors.apartment} {...shippingForm.register("apartment")} />
                <FormField label="City" placeholder="Portland" error={shippingForm.formState.errors.city} {...shippingForm.register("city")} />
                <FormField label="State" placeholder="OR" error={shippingForm.formState.errors.state} {...shippingForm.register("state")} />
                <FormField label="ZIP Code" placeholder="97205" error={shippingForm.formState.errors.zip} {...shippingForm.register("zip")} />
                <FormField label="Phone" placeholder="+1 (555) 019-2231" error={shippingForm.formState.errors.phone} {...shippingForm.register("phone")} />
              </div>
              <Button type="submit" size="lg" variant="brass" className="w-full sm:w-auto">Continue to Delivery</Button>
            </form>
          )}

          {step === "Delivery" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-display text-2xl">Delivery Method</h2>
              <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="gap-3">
                {[
                  { id: "standard", label: "Standard Shipping", copy: "5–7 business days", price: subtotal >= 200 ? 0 : 15 },
                  { id: "express", label: "Express Shipping", copy: "2–3 business days", price: 25 },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors",
                      shippingMethod === opt.id ? "border-ink" : "border-border hover:border-ink/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={opt.id} id={opt.id} />
                      <div>
                        <p className="text-sm font-medium">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.copy}</p>
                      </div>
                    </div>
                    <span className="font-mono text-sm">{opt.price === 0 ? "Free" : formatPrice(opt.price)}</span>
                  </label>
                ))}
              </RadioGroup>
              <div className="flex gap-3">
                <Button size="lg" variant="outline" onClick={back}>Back</Button>
                <Button size="lg" variant="brass" onClick={() => goTo(2)}>Continue to Payment</Button>
              </div>
            </div>
          )}

          {step === "Payment" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-display text-2xl">Payment</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="gap-3">
                {[
                  { id: "card", label: "Credit / Debit Card" },
                  { id: "paypal", label: "PayPal" },
                  { id: "applepay", label: "Apple Pay" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                      paymentMethod === opt.id ? "border-ink" : "border-border hover:border-ink/30"
                    )}
                  >
                    <RadioGroupItem value={opt.id} id={opt.id} />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                ))}
              </RadioGroup>

              {paymentMethod === "card" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    onSubmitPayment()
                  }}
                  noValidate
                  className="grid grid-cols-1 gap-4 rounded-xl border border-border p-4 sm:grid-cols-2"
                >
                  <FormField
                    label="Card Number"
                    placeholder="4242 4242 4242 4242"
                    containerClassName="sm:col-span-2"
                    error={cardForm.formState.errors.cardNumber}
                    {...cardForm.register("cardNumber")}
                  />
                  <FormField label="Expiry" placeholder="MM / YY" error={cardForm.formState.errors.expiry} {...cardForm.register("expiry")} />
                  <FormField label="CVC" placeholder="123" error={cardForm.formState.errors.cvc} {...cardForm.register("cvc")} />
                  <FormField
                    label="Name on Card"
                    placeholder="Amara Whitfield"
                    containerClassName="sm:col-span-2"
                    error={cardForm.formState.errors.nameOnCard}
                    {...cardForm.register("nameOnCard")}
                  />
                </form>
              )}

              <div className="flex gap-3">
                <Button size="lg" variant="outline" onClick={back}>Back</Button>
                <Button size="lg" variant="brass" onClick={onSubmitPayment}>Review Order</Button>
              </div>
            </div>
          )}

          {step === "Review" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-display text-2xl">Review Your Order</h2>
              {shippingValues && (
                <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">
                    {shippingValues.firstName} {shippingValues.lastName}
                  </p>
                  <p>
                    {shippingValues.address}
                    {shippingValues.apartment ? `, ${shippingValues.apartment}` : ""}
                  </p>
                  <p>
                    {shippingValues.city}, {shippingValues.state} {shippingValues.zip}
                  </p>
                  <p>{shippingValues.phone}</p>
                </div>
              )}
              <div className="divide-y divide-border border-y border-border">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.variantLabel} · Qty {item.quantity}</p>
                    </div>
                    <span className="font-mono text-sm">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Paying with {paymentMethod === "card" ? "Credit / Debit Card" : paymentMethod === "paypal" ? "PayPal" : "Apple Pay"} ·{" "}
                {shippingMethod === "express" ? "Express Shipping" : "Standard Shipping"}
              </p>
              <div className="flex gap-3">
                <Button size="lg" variant="outline" onClick={back} disabled={placing}>Back</Button>
                <Button size="lg" variant="brass" onClick={placeOrder} disabled={placing}>
                  {placing ? "Placing Order…" : `Place Order · ${formatPrice(total)}`}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="h-fit rounded-2xl border border-border p-6">
          <h2 className="font-display text-xl">Order Summary</h2>
          <div className="mt-5 max-h-64 space-y-4 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0">
                  <img src={item.image} alt={item.name} className="h-full w-full rounded-lg object-cover" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-background">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-tight">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.variantLabel}</p>
                </div>
                <span className="font-mono text-xs">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <Separator className="my-5" />
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-mono">{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="font-mono">{formatPrice(tax)}</span></div>
          </div>
          <Separator className="my-5" />
          <div className="flex justify-between font-display text-xl">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
