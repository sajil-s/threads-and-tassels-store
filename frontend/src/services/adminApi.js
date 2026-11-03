
import api from "./api";

export async function getDashboardAnalytics(startDate, endDate) {
  const params =
    startDate && endDate ? { startDate, endDate } : {};

  const response = await api.get("/admin/dashboard", { params });
  return response.data;
}

export async function getDashboardRecentOrders() {
  const response = await api.get("/admin/dashboard/recent-orders");
  return response.data;
}