import { z } from "zod"

export const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  address: z.string().min(1, "Address is required"),
  apartment: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z
    .string()
    .min(1, "ZIP code is required")
    .regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[+()\d\s-]{7,}$/, "Enter a valid phone number"),
})
export type ShippingValues = z.infer<typeof shippingSchema>

export const cardSchema = z.object({
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .regex(/^[\d\s]{13,19}$/, "Enter a valid card number"),
  expiry: z
    .string()
    .min(1, "Expiry is required")
    .regex(/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/, "Use MM / YY format"),
  cvc: z
    .string()
    .min(1, "CVC is required")
    .regex(/^\d{3,4}$/, "Enter a valid CVC"),
  nameOnCard: z.string().min(1, "Name on card is required"),
})
export type CardValues = z.infer<typeof cardSchema>

export const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  line1: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z
    .string()
    .min(1, "ZIP code is required")
    .regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[+()\d\s-]{7,}$/, "Enter a valid phone number"),
})
export type AddressValues = z.infer<typeof addressSchema>

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[+()\d\s-]{7,}$/, "Enter a valid phone number"),
})
export type ProfileValues = z.infer<typeof profileSchema>

export const newsletterSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
})
export type NewsletterValues = z.infer<typeof newsletterSchema>
