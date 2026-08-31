import { z } from "zod";
import { FileRefSchema } from "./file-ref";

export const CreateProductSchema = z.object({
  name: z.string().min(1, "Required"),
  sku: z.string().min(1, "Required"),
  description: z.string(),
  price: z.number().optional(),
  compare_at_price: z.number().optional(),
  stock: z.number().int().optional(),
  images: z.array(FileRefSchema).default([]),
  category_id: z.string().uuid("Invalid ID"),
  active: z.boolean().optional(),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(1, "Required").optional(),
  sku: z.string().min(1, "Required").optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  compare_at_price: z.number().optional(),
  stock: z.number().int().optional(),
  images: z.array(FileRefSchema).default([]).optional(),
  category_id: z.string().uuid("Invalid ID").optional(),
  active: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
