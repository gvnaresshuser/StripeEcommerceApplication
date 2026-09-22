import { Request, Response } from "express";
import { OrderService } from "../services/OrderService.js";

const orderService = new OrderService();

export class OrderController {
  // POST /api/orders
  async createOrder(
    req: Request,
    res: Response,
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const result =
        await orderService.createOrderFromCart(
          req.user.id,
        );

      return res.status(201).json({
        message: "Order created successfully",
        ...result,
      });
    } catch (error) {
      console.error(
        "Create order error:",
        error,
      );

      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to create order",
      });
    }
  }

  // GET /api/orders
  async getUserOrders(
    req: Request,
    res: Response,
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const orders =
        await orderService.getUserOrders(
          req.user.id,
        );

      return res.status(200).json({
        orders,
      });
    } catch (error) {
      console.error(
        "Get user orders error:",
        error,
      );

      return res.status(500).json({
        message: "Unable to retrieve orders",
      });
    }
  }

  // GET /api/orders/:id
  async getOrderById(
    req: Request,
    res: Response,
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const orderId =
        Number(req.params.id);

      if (Number.isNaN(orderId)) {
        return res.status(400).json({
          message: "Invalid order ID",
        });
      }

      const result =
        await orderService.getOrderById(
          req.user.id,
          orderId,
        );

      return res.status(200).json(result);
    } catch (error) {
      console.error(
        "Get order error:",
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

      return res.status(404).json({
        message:
          error instanceof Error
            ? error.message
            : "Order not found",
      });
    }
  }

  // POST /api/orders/checkout
async checkout(
  req: Request,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        message: "items must be an array",
      });
    }

    const result =
      await orderService.createOrderFromItems(
        req.user.id,
        items,
      );

    return res.status(201).json({
      message: "Checkout order created successfully",
      ...result,
    });
  } catch (error) {
    console.error(
      "Checkout error:",
      error,
    );

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to create checkout order",
    });
  }
}
}