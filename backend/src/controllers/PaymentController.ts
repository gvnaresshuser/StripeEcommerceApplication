import { Request, Response } from "express";
import { PaymentService } from "../services/PaymentService.js";
import stripe from "../config/stripe.js";

const paymentService =
  new PaymentService();

export class PaymentController {
  async createCheckoutSession(
    req: Request,
    res: Response,
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const { orderId } = req.body;

      if (orderId === undefined) {
        return res.status(400).json({
          message: "Order ID is required",
        });
      }

      const parsedOrderId =
        Number(orderId);

      if (Number.isNaN(parsedOrderId)) {
        return res.status(400).json({
          message: "Invalid order ID",
        });
      }

      const result =
        await paymentService.createCheckoutSession(
          req.user.id,
          parsedOrderId,
        );

      return res.status(200).json({
        message:
          "Stripe Checkout Session created successfully",
        ...result,
      });
    } catch (error) {
      console.error(
        "Create checkout session error:",
        error,
      );

      if (
        error instanceof Error &&
        error.message === "Access denied"
      ) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to create checkout session",
      });
    }
  }
  //-------------------------------------------
    async handleWebhook(
    req: Request,
    res: Response,
  ) {
    const signature =
      req.headers["stripe-signature"];

    if (!signature) {
      return res.status(400).json({
        message:
          "Missing Stripe signature",
      });
    }

    const webhookSecret =
      process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        "STRIPE_WEBHOOK_SECRET is not configured",
      );

      return res.status(500).json({
        message:
          "Stripe webhook secret is not configured",
      });
    }

    try {
      const event =
        stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret,
        );

      console.log(
        `Stripe webhook received: ${event.type}`,
      );

      if (
        event.type ===
        "checkout.session.completed"
      ) {
        const session =
          event.data.object;

        const orderId = Number(
          session.metadata?.orderId,
        );

        if (!orderId) {
          console.error(
            "Order ID missing from Stripe session metadata",
          );

          return res.status(400).json({
            message:
              "Order ID missing from Stripe session metadata",
          });
        }

        await paymentService.updatePaymentFromWebhook(
          orderId,
          session,
        );

        console.log(
          `Payment completed for Order #${orderId}`,
        );
      }

      return res.status(200).json({
        received: true,
      });
    } catch (error) {
      console.error(
        "Stripe webhook error:",
        error,
      );

      return res.status(400).json({
        message:
          "Invalid Stripe webhook",
      });
    }
  }
}