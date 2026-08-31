import { defineResource } from "@/lib/resource";
import custom from "./orders.custom";

export const orderResource = defineResource({
  name: "Order",
  slug: "orders",
  endpoint: "/api/orders",
  icon: "ShoppingCart",
  label: { singular: "Order", plural: "Orders" },
  table: {
    columns: [
      // grit:cols:auto-start
      { key: "number", label: "Number", sortable: true, searchable: true, onClick: "link" },
      { key: "customer_name", label: "Customer Name", sortable: true, searchable: true },
      { key: "customer_email", label: "Customer Email", sortable: true, searchable: true },
      { key: "shipping_address", label: "Shipping Address", searchable: true },
      { key: "phone", label: "Phone", sortable: true, searchable: true },
      { key: "subtotal", label: "Subtotal", sortable: true },
      { key: "shipping", label: "Shipping", sortable: true },
      { key: "total", label: "Total", sortable: true },
      { key: "payment_intent", label: "Payment Intent", sortable: true, searchable: true },
      { key: "status", label: "Status" },
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
    { key: "customer_name", label: "Customer Name", type: "text", required: true },
    { key: "customer_email", label: "Customer Email", type: "text", required: true },
    { key: "shipping_address", label: "Shipping Address", type: "textarea" },
    { key: "phone", label: "Phone", type: "text", required: true },
    { key: "subtotal", label: "Subtotal", type: "number", numberKind: "float" },
    { key: "shipping", label: "Shipping", type: "number", numberKind: "float" },
    { key: "total", label: "Total", type: "number", numberKind: "float" },
    { key: "payment_intent", label: "Payment Intent", type: "text", required: true },
    { key: "status", label: "Status", type: "select", required: true, options: [{ value: "pending", label: "Pending" }, { value: "paid", label: "Paid" }, { value: "packed", label: "Packed" }, { value: "shipped", label: "Shipped" }, { value: "delivered", label: "Delivered" }, { value: "cancelled", label: "Cancelled" }] },
    { key: "items", label: "Order Items", type: "line-items", colSpan: 2, itemEndpoint: "/api/order_items", foreignKey: "order_id", itemFields: [
        { key: "product_id", label: "Product", type: "relationship-select", relatedEndpoint: "/api/products", displayField: "name" },
        { key: "product_name", label: "Product Name", type: "text" },
        { key: "quantity", label: "Quantity", type: "number", numberKind: "int" },
        { key: "unit_price", label: "Unit Price", type: "number", numberKind: "float" },
        { key: "line_total", label: "Line Total", type: "number", numberKind: "float" },
    ] },
      // grit:fields:auto-end
    ],
  },
  dashboard: {
    widgets: [
      {
        type: "stat",
        label: "Total Orders",
        endpoint: "/api/orders",
        icon: "ShoppingCart",
        color: "accent",
      },
    ],
  },
}, custom);
