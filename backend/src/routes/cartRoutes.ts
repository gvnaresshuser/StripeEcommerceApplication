import { Router } from "express";

import { CartController } from "../controllers/CartController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

const cartController = new CartController();

router.get(
  "/",
  authenticate,
  cartController.getCart.bind(cartController),
);

router.post(
  "/items",
  authenticate,
  cartController.addToCart.bind(cartController),
);

router.put(
  "/items/:id",
  authenticate,
  cartController.updateCartItem.bind(
    cartController,
  ),
);

router.delete(
  "/items/:id",
  authenticate,
  cartController.removeFromCart.bind(
    cartController,
  ),
);

router.delete(
  "/",
  authenticate,
  cartController.clearCart.bind(
    cartController,
  ),
);

export default router;