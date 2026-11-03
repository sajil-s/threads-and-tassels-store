
import api from "./api";

export async function createCheckout(payload) {
  const response = await api.post("/orders/checkout", payload);
  return response.data;
}

export async function verifyCheckoutPayment(paymentDetails) {
  const response = await api.post(
    "/orders/verify-payment",
    paymentDetails
  );
  return response.data;
}
