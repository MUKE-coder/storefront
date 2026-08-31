import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

interface OrderItem {
  id: string;
  product_id: string;
  product?: any;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  order_id: string;
  order?: any;
  created_at: string;
  updated_at: string;
}

interface OrderItemsResponse {
  data: OrderItem[];
  meta: {
    total: number;
    page: number;
    page_size: number;
    pages: number;
  };
}

interface UseOrderItemsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function useOrderItems({ page = 1, pageSize = 20, search = "", sortBy = "created_at", sortOrder = "desc" }: UseOrderItemsParams = {}) {
  return useQuery<OrderItemsResponse>({
    queryKey: ["order_items", { page, pageSize, search, sortBy, sortOrder }],
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
      const { data } = await apiClient.get(`/api/order_items?${params}`);
      return data;
    },
  });
}

export function useGetOrderItem(id: string) {
  return useQuery<OrderItem>({
    queryKey: ["order_items", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/order_items/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateOrderItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const { data } = await apiClient.post("/api/order_items", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order_items"] });
    },
  });
}

export function useUpdateOrderItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: { id: string } & Record<string, unknown>) => {
      const { data } = await apiClient.put(`/api/order_items/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order_items"] });
    },
  });
}

export function useDeleteOrderItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/order_items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order_items"] });
    },
  });
}
