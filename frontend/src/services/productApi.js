
import api from "./api";

export const getTrendingProducts = async () => {
  const response = await api.get("/products/trending");
  return response.data;
};

export async function getProducts(
  page = 1,
  limit = 12,
  search = "",
  category = ""
) {
  const response = await api.get("/products", {
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
      ...(category ? { category } : {}),
    },
  });

  return response.data;
}

export async function getProductById(productId) {
  const response = await api.get(
    `/products/${encodeURIComponent(productId)}`
  );

  return response.data;
}



