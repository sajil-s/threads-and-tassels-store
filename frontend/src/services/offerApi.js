import api from "./api";

export const getCurrentOffer = async () => {
  const response = await api.get("/offers");
  return response.data;
};