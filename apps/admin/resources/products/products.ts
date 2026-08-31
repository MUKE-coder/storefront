import { defineResource } from "@/lib/resource";
import custom from "./products.custom";

export const productResource = defineResource({
  name: "Product",
  slug: "products",
  endpoint: "/api/products",
  icon: "Package",
  label: { singular: "Product", plural: "Products" },
  table: {
    columns: [
      // grit:cols:auto-start
      { key: "name", label: "Name", sortable: true, searchable: true, onClick: "link" },
      { key: "slug", label: "Slug", sortable: true, searchable: true },
      { key: "sku", label: "Sku", sortable: true, searchable: true },
      { key: "description", label: "Description", searchable: true, format: "richtext" },
      { key: "price", label: "Price", sortable: true },
      { key: "compare_at_price", label: "Compare At Price", sortable: true },
      { key: "stock", label: "Stock", sortable: true },
      { key: "images", label: "Images", format: "files" },
      { key: "category.name", label: "Category" },
      { key: "active", label: "Active", format: "boolean" },
      { key: "created_at", label: "Created", sortable: true, format: "relative" },
      // grit:cols:auto-end
    ],
    filters: [
    { key: "active", label: "Active", type: "boolean" },
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
    { key: "sku", label: "Sku", type: "text", required: true, unique: true },
    { key: "description", label: "Description", type: "richtext" },
    { key: "price", label: "Price", type: "number", numberKind: "float" },
    { key: "compare_at_price", label: "Compare At Price", type: "number", numberKind: "float" },
    { key: "stock", label: "Stock", type: "number", numberKind: "int" },
    { key: "images", label: "Images", type: "files", accepts: ["image"], maxSizeMB: 5, max: 5 },
    { key: "category_id", label: "Category", type: "relationship-select", required: true, relatedEndpoint: "/api/categories", displayField: "name" },
    { key: "active", label: "Active", type: "toggle" },
      // grit:fields:auto-end
    ],
  },
  dashboard: {
    widgets: [
      {
        type: "stat",
        label: "Total Products",
        endpoint: "/api/products",
        icon: "Package",
        color: "accent",
      },
    ],
  },
}, custom);
