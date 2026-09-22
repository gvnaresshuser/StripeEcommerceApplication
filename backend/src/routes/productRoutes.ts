import { Router } from "express";
import { ProductController } from "../controllers/ProductController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = Router();

const productController = new ProductController();

// CUSTOMER + ADMIN
router.get(
  "/",
  authenticate,
  productController.getAllProducts.bind(productController),
);

router.get(
  "/:id",
  authenticate,
  productController.getProductById.bind(productController),
);

// ADMIN ONLY
router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  productController.createProduct.bind(productController),
);

router.put(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  productController.updateProduct.bind(productController),
);

router.delete(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  productController.deleteProduct.bind(productController),
);

export default router;