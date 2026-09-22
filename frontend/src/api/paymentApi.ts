import api from "./axios";

export interface CheckoutSessionResponse {
  message: string;
  orderId: number;
  sessionId: string;
  checkoutUrl: string;
}

export const createCheckoutSession = async (
  orderId: number,
): Promise<CheckoutSessionResponse> => {
  const response = await api.post(
    "/payments/create-checkout-session",
    {
      orderId,
    },
  );

  return response.data;
};