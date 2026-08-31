import { defineResource } from "@/lib/resource";
import custom from "./categories.custom";

export const categoryResource = defineResource({
  name: "Category",
  slug: "categories",
  tree: true,
  endpoint: "/api/categories",
  icon: "FolderTree",
  label: { singular: "Category", plural: "Categories" },
  table: {
    columns: [
      // grit:cols:auto-start
      { key: "name", label: "Name", sortable: true, searchable: true, onClick: "link" },
      { key: "slug", label: "Slug", sortable: true, searchable: true },
      { key: "description", label: "Description", searchable: true },
      { key: "image", label: "Image", format: "file" },
      { key: "featured", label: "Featured", format: "boolean" },
      { key: "parent.name", label: "Parent" },
      { key: "created_at", label: "Created", sortable: true, format: "relative" },
      // grit:cols:auto-end
    ],
    filters: [
    { key: "featured", label: "Featured", type: "boolean" },
    ],
    defaultSort: { key: "created_at", direction: "desc" },
    searchable: true,
    pageSize: 20,
    // Shown once rows are ticked. Drop "archive" here and the Archived tab
    // goes with it; the model keeps its archived_at either way.
    bulkActions: ["edit", "archive", "restore", "export", "delete"],
  },
  form: {
    fields: [
      // grit:fields:auto-start
    { key: "name", label: "Name", type: "text", required: true },
    { key: "description", label: "Description", type: "textarea" },
    { key: "image", label: "Image", type: "file", accepts: ["image"], maxSizeMB: 5 },
    { key: "featured", label: "Featured", type: "toggle" },
    { key: "parent_id", label: "Parent", type: "relationship-select", relatedEndpoint: "/api/categories", displayField: "name" },
      // grit:fields:auto-end
    ],
  },
  dashboard: {
    widgets: [
      {
        type: "stat",
        label: "Total Categories",
        endpoint: "/api/categories",
        icon: "FolderTree",
        color: "accent",
      },
    ],
  },
}, custom);
