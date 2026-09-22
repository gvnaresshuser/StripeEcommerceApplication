import { CartRepository } from "../repositories/CartRepository.js";
import { ProductRepository } from "../repositories/ProductRepository.js";

export class CartService {
  private cartRepository = new CartRepository();
  private productRepository = new ProductRepository();

  // Get existing cart or create one
  async getOrCreateCart(userId: number) {
    let cart =
      await this.cartRepository.findCartByUserId(userId);

    if (!cart) {
      cart =
        await this.cartRepository.createCart(userId);
    }

    return cart;
  }

  // Get cart with all items
  async getCart(userId: number) {
    const cart =
      await this.getOrCreateCart(userId);

    const items =
      await this.cartRepository.findCartItems(
        cart.id,
      );

    return {
      cart,
      items,
    };
  }

  // Add product to cart
  async addToCart(
    userId: number,
    productId: number,
    quantity: number,
  ) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(
        "Quantity must be a positive integer",
      );
    }

    const product =
      await this.productRepository.findById(
        productId,
      );

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < quantity) {
      throw new Error(
        `Only ${product.stock} item(s) available in stock`,
      );
    }

    const cart =
      await this.getOrCreateCart(userId);

    const existingItem =
      await this.cartRepository.findCartItem(
        cart.id,
        productId,
      );

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        throw new Error(
          `Only ${product.stock} item(s) available in stock`,
        );
      }

      return await this.cartRepository.updateCartItem(
        existingItem.id,
        newQuantity,
      );
    }

    return await this.cartRepository.addCartItem({
      cartId: cart.id,
      productId,
      quantity,
    });
  }

  // Update cart item quantity
  async updateCartItem(
    userId: number,
    cartItemId: number,
    quantity: number,
  ) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(
        "Quantity must be a positive integer",
      );
    }

    const cart =
      await this.getOrCreateCart(userId);

    const items =
      await this.cartRepository.findCartItems(
        cart.id,
      );

    const cartItem = items.find(
      (item) => item.id === cartItemId,
    );

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    const product =
      await this.productRepository.findById(
        cartItem.productId,
      );

    if (!product) {
      throw new Error("Product not found");
    }

    if (quantity > product.stock) {
      throw new Error(
        `Only ${product.stock} item(s) available in stock`,
      );
    }

    return await this.cartRepository.updateCartItem(
      cartItemId,
      quantity,
    );
  }

  // Remove item from cart
  async removeFromCart(
    userId: number,
    cartItemId: number,
  ) {
    const cart =
      await this.getOrCreateCart(userId);

    const items =
      await this.cartRepository.findCartItems(
        cart.id,
      );

    const cartItem = items.find(
      (item) => item.id === cartItemId,
    );

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    await this.cartRepository.removeCartItem(
      cartItemId,
    );

    return {
      message: "Item removed from cart",
    };
  }

  // Clear cart
  async clearCart(userId: number) {
    const cart =
      await this.getOrCreateCart(userId);

    await this.cartRepository.clearCart(
      cart.id,
    );

    return {
      message: "Cart cleared successfully",
    };
  }
}