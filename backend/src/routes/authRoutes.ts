import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

const authController = new AuthController();

router.post(
  "/register",
  authController.register.bind(authController),
);

router.post(
  "/login",
  authController.login.bind(authController),
);

router.get(
  "/me",
  authenticate,
  authController.me.bind(authController),
);

router.post(
  "/logout",
  authController.logout.bind(authController),
);

export default router;