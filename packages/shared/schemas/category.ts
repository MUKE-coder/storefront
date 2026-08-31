import { z } from "zod";
import { FileRefSchema } from "./file-ref";

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  image: FileRefSchema.nullable(),
  featured: z.boolean().optional(),
  parent_id: z.string().uuid("Invalid ID").or(z.literal("")),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(1, "Required").optional(),
  description: z.string().optional(),
  image: FileRefSchema.nullable(),
  featured: z.boolean().optional(),
  parent_id: z.string().uuid("Invalid ID").or(z.literal("")).optional(),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
