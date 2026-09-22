import stripe from "../config/stripe.js";
import { OrderRepository } from "../repositories/OrderRepository.js";

export class PaymentService {
  private orderRepository =
    new OrderRepository();

  async createCheckoutSession(
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

    if (order.status !== "PENDING") {
      throw new Error(
        "Only pending orders can be paid",
      );
    }

    if (order.paymentStatus === "SUCCEEDED") {
      throw new Error(
        "Order has already been paid",
      );
    }

    const items =
      await this.orderRepository.findOrderItems(
        orderId,
      );

    if (items.length === 0) {
      throw new Error(
        "Order has no items",
      );
    }

    const lineItems =
      items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productName,
          },
          unit_amount: Math.round(
            Number(item.unitPrice) * 100,
          ),
        },
        quantity: item.quantity,
      }));

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        line_items: lineItems,

        success_url:
  `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${process.env.FRONTEND_URL}/payment-cancelled`,

        metadata: {
          orderId: String(order.id),
          userId: String(userId),
        },
      });

    await this.orderRepository.updatePaymentDetails(
      order.id,
      {
        stripeSessionId: session.id,
        paymentStatus: "PENDING",
      },
    );

    return {
      orderId: order.id,
      sessionId: session.id,
      checkoutUrl: session.url,
    };
  }
  //--------------------------------------
    async updatePaymentFromWebhook(
    orderId: number,
    session: import("stripe").Stripe.Checkout.Session,
  ) {
    const order =
      await this.orderRepository.findById(
        orderId,
      );

    if (!order) {
      throw new Error(
        "Order not found",
      );
    }

    if (
      session.payment_status !==
      "paid"
    ) {
      console.log(
        `Stripe session ${session.id} is not paid`,
      );

      return order;
    }

    const paymentIntentId =
      typeof session.payment_intent ===
      "string"
        ? session.payment_intent
        : null;

    const updatedOrder =
      await this.orderRepository.updatePaymentDetails(
        orderId,
        {
          stripeSessionId: session.id,
          stripePaymentIntentId:
            paymentIntentId,
          paymentStatus: "SUCCEEDED",
        },
      );

    if (!updatedOrder) {
      throw new Error(
        "Unable to update payment details",
      );
    }

    await this.orderRepository.updateStatus(
      orderId,
      "PAID",
    );

    return updatedOrder;
  }
}