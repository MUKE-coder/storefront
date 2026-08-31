"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { FormField } from "@/components/shared/form-field"
import { currentCustomer } from "@/data/account"
import { profileSchema, type ProfileValues } from "@/lib/checkout-schemas"

export default function ProfileSettingsPage() {
  const [saved, setSaved] = React.useState(false)

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: currentCustomer.firstName,
      lastName: currentCustomer.lastName,
      email: currentCustomer.email,
      phone: currentCustomer.phone,
    },
  })

  function onSubmit() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-xl space-y-10">
      <div>
        <h2 className="mb-6 font-display text-2xl">Profile Settings</h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="First Name" error={form.formState.errors.firstName} {...form.register("firstName")} />
            <FormField label="Last Name" error={form.formState.errors.lastName} {...form.register("lastName")} />
          </div>
          <FormField label="Email" type="email" error={form.formState.errors.email} {...form.register("email")} />
          <FormField label="Phone" error={form.formState.errors.phone} {...form.register("phone")} />
          <Button type="submit" variant="brass">
            {saved ? (
              <>
                <Check className="h-4 w-4" /> Saved
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </div>

      <Separator />

      <div>
        <h2 className="mb-4 font-display text-2xl">Communication</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox defaultChecked /> New arrivals and product news
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox defaultChecked /> Order and shipping updates
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox /> Private sales and offers
          </label>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="mb-2 font-display text-2xl text-destructive">Danger Zone</h2>
        <p className="mb-4 text-sm text-muted-foreground">Deleting your account is permanent and cannot be undone.</p>
        <Button variant="destructive">Delete Account</Button>
      </div>
    </div>
  )
}
