import type { FileRef } from "../schemas/file-ref";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: FileRef | null;
  featured: boolean;
  parent_id: string | null;
  parent?: Category;
  created_at: string;
  updated_at: string;
}
