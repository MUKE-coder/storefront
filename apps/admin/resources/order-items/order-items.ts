import { defineResource } from "@/lib/resource";
import custom from "./order-items.custom";

export const orderItemResource = defineResource({
  name: "OrderItem",
  slug: "order-items",
  hidden: true,
  endpoint: "/api/order_items",
  icon: "ShoppingCart",
  label: { singular: "OrderItem", plural: "OrderItems" },
  table: {
    columns: [
      // grit:cols:auto-start
      { key: "product.name", label: "Product" },
      { key: "product_name", label: "Product Name", sortable: true, searchable: true, onClick: "link" },
      { key: "quantity", label: "Quantity", sortable: true },
      { key: "unit_price", label: "Unit Price", sortable: true },
      { key: "line_total", label: "Line Total", sortable: true },
      { key: "order.name", label: "Order" },
      { key: "created_at", label: "Created", sortable: true, format: "relative" },
      // grit:cols:auto-end
    ],
    filters: [
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
    { key: "product_id", label: "Product", type: "relationship-select", required: true, relatedEndpoint: "/api/products", displayField: "name" },
    { key: "product_name", label: "Product Name", type: "text", required: true },
    { key: "quantity", label: "Quantity", type: "number", numberKind: "int" },
    { key: "unit_price", label: "Unit Price", type: "number", numberKind: "float" },
    { key: "line_total", label: "Line Total", type: "number", numberKind: "float" },
    { key: "order_id", label: "Order", type: "relationship-select", required: true, relatedEndpoint: "/api/orders", displayField: "name" },
      // grit:fields:auto-end
    ],
  },
  dashboard: {
    widgets: [
      {
        type: "stat",
        label: "Total OrderItems",
        endpoint: "/api/order_items",
        icon: "ShoppingCart",
        color: "accent",
      },
    ],
  },
}, custom);
