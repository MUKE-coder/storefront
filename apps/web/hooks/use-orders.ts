import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

interface Order {
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

interface OrdersResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    page_size: number;
    pages: number;
  };
}

interface UseOrdersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function useOrders({ page = 1, pageSize = 20, search = "", sortBy = "created_at", sortOrder = "desc" }: UseOrdersParams = {}) {
  return useQuery<OrdersResponse>({
    queryKey: ["orders", { page, pageSize, search, sortBy, sortOrder }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      if (search) {
        params.set("search", search);
      }
      const { data } = await apiClient.get(`/api/orders?${params}`);
      return data;
    },
  });
}

export function useGetOrder(id: string) {
  return useQuery<Order>({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/orders/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const { data } = await apiClient.post("/api/orders", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: { id: string } & Record<string, unknown>) => {
      const { data } = await apiClient.put(`/api/orders/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
