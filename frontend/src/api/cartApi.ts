import api from "./axios";

export interface CartItem {
  id: number;
  quantity: number;
  productId: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
  };
}

export interface CartInfo {
  id: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  cart: CartInfo;
  items: CartItem[];
}

export const getCart = async (): Promise<CartResponse> => {
  const response = await api.get("/cart");

  console.log("CART API RESPONSE:", response.data);

  return response.data;
};

export const addToCart = async (
  productId: number,
  quantity: number = 1
) => {
  const response = await api.post("/cart/items", {
    productId,
    quantity,
  });

  return response.data;
};