export interface CheckoutItem {
  productId: number;
  quantity: number;
}

export interface CheckoutRequest {
  items: CheckoutItem[];
}