import type { Product } from "./product";
import type { Order } from "./order";

export interface OrderItem {
  id: string;
  product_id: string;
  product?: Product;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  order_id: string;
  order?: Order;
  created_at: string;
  updated_at: string;
}
