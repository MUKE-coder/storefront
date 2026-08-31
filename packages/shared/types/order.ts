export interface Order {
  id: string;
  number: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  phone: string;
  subtotal: number;
  shipping: number;
  total: number;
  payment_intent: string;
  status: "pending" | "paid" | "packed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  updated_at: string;
}
