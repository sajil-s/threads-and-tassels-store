
import api from "./api";

// Get orders belonging to the logged-in customer
export async function getMyOrders(page = 1, limit = 5) {
  const response = await api.get("/orders/my-orders", {
    params: { page, limit },
  });

  return response.data;
}

// Get the details of one customer order
export async function getMyOrderById(orderId) {
  const response = await api.get(
    `/orders/my-orders/${encodeURIComponent(orderId)}`
  );

  return response.data;
}
