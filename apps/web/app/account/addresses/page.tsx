"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, MoreVertical, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FormField } from "@/components/shared/form-field"
import { addresses as seedAddresses } from "@/data/account"
import { addressSchema, type AddressValues } from "@/lib/checkout-schemas"
import { cn } from "@/lib/utils"
import type { Address } from "@/types"

export default function AddressesPage() {
  const [addresses, setAddresses] = React.useState<Address[]>(seedAddresses)
  const [open, setOpen] = React.useState(false)

  const form = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { fullName: "", line1: "", city: "", state: "", zip: "", phone: "" },
  })

  function makeDefault(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
  }

  function remove(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  function onSubmit(values: AddressValues) {
    const newAddress: Address = { id: `addr-${Date.now()}`, country: "United States", ...values }
    setAddresses((prev) => [...prev, newAddress])
    setOpen(false)
    form.reset()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl">Saved Addresses</h2>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o)
            if (!o) form.reset()
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" /> Add Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new address</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
              <FormField
                label="Full Name"
                placeholder="Amara Whitfield"
                containerClassName="sm:col-span-2"
                error={form.formState.errors.fullName}
                {...form.register("fullName")}
              />
              <FormField
                label="Street Address"
                placeholder="482 Halden Street"
                containerClassName="sm:col-span-2"
                error={form.formState.errors.line1}
                {...form.register("line1")}
              />
              <FormField label="City" placeholder="Portland" error={form.formState.errors.city} {...form.register("city")} />
              <FormField label="State" placeholder="OR" error={form.formState.errors.state} {...form.register("state")} />
              <FormField label="ZIP Code" placeholder="97205" error={form.formState.errors.zip} {...form.register("zip")} />
              <FormField label="Phone" placeholder="+1 (555) 019-2231" error={form.formState.errors.phone} {...form.register("phone")} />
              <DialogFooter className="sm:col-span-2">
                <Button type="submit" variant="brass" className="w-full">Save Address</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {addresses.map((address) => (
          <div key={address.id} className={cn("relative rounded-2xl border p-5", address.isDefault ? "border-ink" : "border-border")}>
            {address.isDefault && (
              <span className="absolute right-4 top-4 flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <Star className="h-3 w-3 fill-foreground text-foreground" /> Default
              </span>
            )}
            <p className="font-medium">{address.fullName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{address.line1}</p>
            {address.line2 && <p className="text-sm text-muted-foreground">{address.line2}</p>}
            <p className="text-sm text-muted-foreground">
              {address.city}, {address.state} {address.zip}
            </p>
            <p className="text-sm text-muted-foreground">{address.phone}</p>
            <div className="mt-4 flex items-center gap-2">
              {!address.isDefault && (
                <Button size="sm" variant="outline" onClick={() => makeDefault(address.id)}>
                  Make Default
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="ml-auto h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => remove(address.id)} className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
