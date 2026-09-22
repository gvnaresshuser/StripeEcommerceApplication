import { Router } from "express";

import { OrderController } from "../controllers/OrderController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

const orderController =
  new OrderController();

// Create order from cart
router.post(
  "/",
  authenticate,
  orderController.createOrder.bind(
    orderController,
  ),
);

// Get current user's orders
router.get(
  "/",
  authenticate,
  orderController.getUserOrders.bind(
    orderController,
  ),
);

// Get one order
router.get(
  "/:id",
  authenticate,
  orderController.getOrderById.bind(
    orderController,
  ),
);

router.post(
  "/checkout",
  authenticate,
  orderController.checkout.bind(orderController),
);

export default router;