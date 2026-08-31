import { z } from "zod";

export const CreateOrderSchema = z.object({
  number: z.string().optional(),
  customer_name: z.string().min(1, "Required"),
  customer_email: z.string().min(1, "Required"),
  shipping_address: z.string().optional(),
  phone: z.string().min(1, "Required"),
  subtotal: z.number().optional(),
  shipping: z.number().optional(),
  total: z.number().optional(),
  payment_intent: z.string().min(1, "Required"),
  status: z.enum(["pending", "paid", "packed", "shipped", "delivered", "cancelled"]),
});

export const UpdateOrderSchema = z.object({
  number: z.string().optional(),
  customer_name: z.string().min(1, "Required").optional(),
  customer_email: z.string().min(1, "Required").optional(),
  shipping_address: z.string().optional(),
  phone: z.string().min(1, "Required").optional(),
  subtotal: z.number().optional(),
  shipping: z.number().optional(),
  total: z.number().optional(),
  payment_intent: z.string().min(1, "Required").optional(),
  status: z.enum(["pending", "paid", "packed", "shipped", "delivered", "cancelled"]).optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
