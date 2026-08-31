import { z } from "zod";

export const CreateOrderItemSchema = z.object({
  product_id: z.string().uuid("Invalid ID"),
  product_name: z.string().min(1, "Required"),
  quantity: z.number().int().optional(),
  unit_price: z.number().optional(),
  line_total: z.number().optional(),
  order_id: z.string().uuid("Invalid ID"),
});

export const UpdateOrderItemSchema = z.object({
  product_id: z.string().uuid("Invalid ID").optional(),
  product_name: z.string().min(1, "Required").optional(),
  quantity: z.number().int().optional(),
  unit_price: z.number().optional(),
  line_total: z.number().optional(),
  order_id: z.string().uuid("Invalid ID").optional(),
});

export type CreateOrderItemInput = z.infer<typeof CreateOrderItemSchema>;
export type UpdateOrderItemInput = z.infer<typeof UpdateOrderItemSchema>;
