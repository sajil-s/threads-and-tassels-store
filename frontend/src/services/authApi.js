
import api from "./api";

// Register a new customer
export async function registerUser(userData) {
  const response = await api.post("/auth/register", userData);
  return response.data;
}

// Login customer
export async function loginUser(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

// Get currently logged-in customer
export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}

// Logout customer
export async function logoutUser() {
  const response = await api.post("/auth/logout");
  return response.data;
}
