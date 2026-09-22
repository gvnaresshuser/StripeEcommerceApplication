import api from "./axios";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products");

  return response.data.products;
};

export const getProduct = async (
  id: number
): Promise<Product> => {
  const response = await api.get(`/products/${id}`);

  console.log("PRODUCT DETAILS API RESPONSE:", response.data);

  return response.data.product;
};