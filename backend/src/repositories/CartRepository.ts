import AppDataSource from "../config/database.js";
import { Cart } from "../entities/Cart.js";
import { CartItem } from "../entities/CartItem.js";

export class CartRepository {
  private cartRepository =
    AppDataSource.getRepository(Cart);

  private cartItemRepository =
    AppDataSource.getRepository(CartItem);

  // Find cart belonging to a user
  async findCartByUserId(
    userId: number,
  ): Promise<Cart | null> {
    return await this.cartRepository.findOne({
      where: {
        userId,
      },
    });
  }

  // Create a new cart
  async createCart(userId: number): Promise<Cart> {
    const cart = this.cartRepository.create({
      userId,
    });

    return await this.cartRepository.save(cart);
  }

  // Find a specific item inside a cart
  async findCartItem(
    cartId: number,
    productId: number,
  ): Promise<CartItem | null> {
    return await this.cartItemRepository.findOne({
      where: {
        cartId,
        productId,
      },
    });
  }

  // Add a new item to cart
  async addCartItem(
    cartItemData: Partial<CartItem>,
  ): Promise<CartItem> {
    const cartItem =
      this.cartItemRepository.create(cartItemData);

    return await this.cartItemRepository.save(cartItem);
  }

  // Update cart item quantity
  async updateCartItem(
    cartItemId: number,
    quantity: number,
  ): Promise<CartItem | null> {
    const cartItem =
      await this.cartItemRepository.findOne({
        where: {
          id: cartItemId,
        },
      });

    if (!cartItem) {
      return null;
    }

    cartItem.quantity = quantity;

    return await this.cartItemRepository.save(cartItem);
  }

  // Remove item from cart
  async removeCartItem(
    cartItemId: number,
  ): Promise<boolean> {
    const result =
      await this.cartItemRepository.delete(
        cartItemId,
      );

    return result.affected !== 0;
  }

  // Get all items in a cart
  async findCartItems(
    cartId: number,
  ): Promise<CartItem[]> {
    return await this.cartItemRepository.find({
      where: {
        cartId,
      },
      order: {
        createdAt: "ASC",
      },
    });
  }

  // Clear all items from a cart
  async clearCart(
    cartId: number,
  ): Promise<void> {
    await this.cartItemRepository.delete({
      cartId,
    });
  }
}