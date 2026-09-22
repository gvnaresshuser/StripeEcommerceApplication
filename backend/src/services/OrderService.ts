import AppDataSource from "../config/database.js";
import { CartRepository } from "../repositories/CartRepository.js";
import { ProductRepository } from "../repositories/ProductRepository.js";
import { OrderRepository } from "../repositories/OrderRepository.js";
import { Order } from "../entities/Order.js";
import { OrderItem } from "../entities/OrderItem.js";
import { CartItem } from "../entities/CartItem.js";

export class OrderService {
  private cartRepository = new CartRepository();
  private productRepository = new ProductRepository();
  private orderRepository = new OrderRepository();

  async createOrderFromCart(userId: number) {
    const cart =
      await this.cartRepository.findCartByUserId(
        userId,
      );

    if (!cart) {
      throw new Error("Cart not found");
    }

    const cartItems =
      await this.cartRepository.findCartItems(
        cart.id,
      );

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    const orderItemsData: Array<{
      productId: number;
      productName: string;
      unitPrice: string;
      quantity: number;
      subtotal: string;
    }> = [];

    let totalAmount = 0;

    for (const cartItem of cartItems) {
      const product =
        await this.productRepository.findById(
          cartItem.productId,
        );

      if (!product) {
        throw new Error(
          `Product ${cartItem.productId} not found`,
        );
      }

      if (cartItem.quantity > product.stock) {
        throw new Error(
          `Insufficient stock for ${product.name}. Available stock: ${product.stock}`,
        );
      }

      const unitPrice =
        Number(product.price);

      const subtotal =
        unitPrice * cartItem.quantity;

      totalAmount += subtotal;

      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        unitPrice: unitPrice.toFixed(2),
        quantity: cartItem.quantity,
        subtotal: subtotal.toFixed(2),
      });
    }

    const queryRunner =
      AppDataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
   const order =
  queryRunner.manager.create(Order, {
    userId,
    totalAmount: totalAmount.toFixed(2),
    status: "PENDING",
  });

      const savedOrder =
        await queryRunner.manager.save(order);

      for (const itemData of orderItemsData) {
       const orderItem =
            queryRunner.manager.create(
                OrderItem,
                {
                orderId: savedOrder.id,
                ...itemData,
                },
            );

        await queryRunner.manager.save(
          orderItem,
        );
      }

      await queryRunner.manager.delete(
        CartItem,
        {
            cartId: cart.id,
        },
        );

      await queryRunner.commitTransaction();

      return {
        order: savedOrder,
        items: orderItemsData,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOrderById(
    userId: number,
    orderId: number,
  ) {
    const order =
      await this.orderRepository.findById(
        orderId,
      );

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.userId !== userId) {
      throw new Error("Access denied");
    }

    const items =
      await this.orderRepository.findOrderItems(
        orderId,
      );

    return {
      order,
      items,
    };
  }

  async getUserOrders(userId: number) {
    const orders =
      await this.orderRepository.findByUserId(
        userId,
      );

    return orders;
  }

  async createOrderFromItems(
  userId: number,
  items: Array<{
    productId: number;
    quantity: number;
  }>,
) {
  if (items.length === 0) {
    throw new Error("Checkout cart is empty");
  }

  const orderItemsData: Array<{
    productId: number;
    productName: string;
    unitPrice: string;
    quantity: number;
    subtotal: string;
  }> = [];

  let totalAmount = 0;

  for (const item of items) {
    if (item.quantity <= 0) {
      throw new Error(
        `Invalid quantity for product ${item.productId}`,
      );
    }

    const product =
      await this.productRepository.findById(
        item.productId,
      );

    if (!product) {
      throw new Error(
        `Product ${item.productId} not found`,
      );
    }

    if (item.quantity > product.stock) {
      throw new Error(
        `Insufficient stock for ${product.name}. Available stock: ${product.stock}`,
      );
    }

    const unitPrice =
      Number(product.price);

    const subtotal =
      unitPrice * item.quantity;

    totalAmount += subtotal;

    orderItemsData.push({
      productId: product.id,
      productName: product.name,
      unitPrice: unitPrice.toFixed(2),
      quantity: item.quantity,
      subtotal: subtotal.toFixed(2),
    });
  }

  const queryRunner =
    AppDataSource.createQueryRunner();

  await queryRunner.connect();

  await queryRunner.startTransaction();

  try {
    const order =
      queryRunner.manager.create(Order, {
        userId,
        totalAmount: totalAmount.toFixed(2),
        status: "PENDING",
      });

    const savedOrder =
      await queryRunner.manager.save(order);

    for (const itemData of orderItemsData) {
      const orderItem =
        queryRunner.manager.create(
          OrderItem,
          {
            orderId: savedOrder.id,
            ...itemData,
          },
        );

      await queryRunner.manager.save(
        orderItem,
      );
    }

    await queryRunner.commitTransaction();

    return {
      order: savedOrder,
      items: orderItemsData,
    };
  } catch (error) {
    await queryRunner.rollbackTransaction();

    throw error;
  } finally {
    await queryRunner.release();
  }
}
}