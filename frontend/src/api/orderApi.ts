import api from "./axios";

export interface CheckoutItem {
  productId: number;
  quantity: number;
}

export interface CheckoutResponse {
  message: string;

  order: {
    id: number;
    userId: number;
    totalAmount: string;
    status: string;
    stripeSessionId: string | null;
    stripePaymentIntentId: string | null;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
  };

  items: Array<{
    productId: number;
    productName: string;
    unitPrice: string;
    quantity: number;
    subtotal: string;
  }>;
}

export interface UserOrder {
  id: number;
  userId: number;
  totalAmount: string;
  status: string;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}


export const createCheckoutOrder = async (
  items: CheckoutItem[],
): Promise<CheckoutResponse> => {
  const response = await api.post(
    "/orders/checkout",
    {
      items,
    },
  );

  return response.data;
};

export const getOrder = async (id: number) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getUserOrders = async (): Promise<UserOrder[]> => {
  const response = await api.get("/orders");

  return response.data.orders;
};