
import api from "./api";

export async function getCart() {
  const response = await api.get("/cart");
  return response.data;
}

export async function addToCart(productId, quantity = 1) {
  const response = await api.post("/cart", {
    productId,
    quantity,
  });

  return response.data;
}

export async function updateCartQuantity(productId, quantity) {
  const response = await api.patch(
    `/cart/${encodeURIComponent(productId)}`,
    { quantity }
  );

  return response.data;
}

export async function removeCartItem(productId) {
  const response = await api.delete(
    `/cart/${encodeURIComponent(productId)}`
  );

  return response.data;
}
