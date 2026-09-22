import AppDataSource from "../config/database.js";
import { Order } from "../entities/Order.js";
import { OrderItem } from "../entities/OrderItem.js";

export class OrderRepository {
  private orderRepository =
    AppDataSource.getRepository(Order);

  private orderItemRepository =
    AppDataSource.getRepository(OrderItem);

  // Create a new order
  async createOrder(
    orderData: Partial<Order>,
  ): Promise<Order> {
    const order =
      this.orderRepository.create(orderData);

    return await this.orderRepository.save(order);
  }

  // Create an order item
  async createOrderItem(
    orderItemData: Partial<OrderItem>,
  ): Promise<OrderItem> {
    const orderItem =
      this.orderItemRepository.create(
        orderItemData,
      );

    return await this.orderItemRepository.save(
      orderItem,
    );
  }

  // Find order by ID
  async findById(
    orderId: number,
  ): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
    });
  }

  // Find all orders for a user
  async findByUserId(
    userId: number,
  ): Promise<Order[]> {
    return await this.orderRepository.find({
      where: {
        userId,
      },
      order: {
        createdAt: "DESC",
      },
    });
  }

  // Find order items
  async findOrderItems(
    orderId: number,
  ): Promise<OrderItem[]> {
    return await this.orderItemRepository.find({
      where: {
        orderId,
      },
      order: {
        createdAt: "ASC",
      },
    });
  }

  // Update order status
  async updateStatus(
    orderId: number,
    status: string,
  ): Promise<Order | null> {
    const order =
      await this.orderRepository.findOne({
        where: {
          id: orderId,
        },
      });

    if (!order) {
      return null;
    }

    order.status = status;

    return await this.orderRepository.save(order);
  }

  async updatePaymentDetails(
  orderId: number,
  paymentData: {
    stripeSessionId?: string;
    stripePaymentIntentId?: string | null;
    paymentStatus?: string;
  },
): Promise<Order | null> {
  const order =
    await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
    });

  if (!order) {
    return null;
  }

  if (
    paymentData.stripeSessionId !== undefined
  ) {
    order.stripeSessionId =
      paymentData.stripeSessionId;
  }

  if (
    paymentData.stripePaymentIntentId !==
    undefined
  ) {
    order.stripePaymentIntentId =
      paymentData.stripePaymentIntentId;
  }

  if (
    paymentData.paymentStatus !== undefined
  ) {
    order.paymentStatus =
      paymentData.paymentStatus;
  }

  return await this.orderRepository.save(order);
}
}