import { Router } from "express";

import { PaymentController } from "../controllers/PaymentController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

const paymentController =
  new PaymentController();

router.post(
  "/create-checkout-session",
  authenticate,
  paymentController.createCheckoutSession.bind(
    paymentController,
  ),
);

router.post(
  "/webhook",
  paymentController.handleWebhook.bind(
    paymentController,
  ),
);

export default router;