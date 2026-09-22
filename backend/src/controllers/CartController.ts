import { Request, Response } from "express";
import { CartService } from "../services/CartService.js";

const cartService = new CartService();

export class CartController {
  // GET /api/cart
  async getCart(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const result =
        await cartService.getCart(
          req.user.id,
        );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Get cart error:", error);

      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to retrieve cart",
      });
    }
  }

  // POST /api/cart/items
  async addToCart(
    req: Request,
    res: Response,
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const { productId, quantity } =
        req.body;

      if (
        productId === undefined ||
        quantity === undefined
      ) {
        return res.status(400).json({
          message:
            "Product ID and quantity are required",
        });
      }

      const item =
        await cartService.addToCart(
          req.user.id,
          Number(productId),
          Number(quantity),
        );

      return res.status(201).json({
        message: "Product added to cart",
        item,
      });
    } catch (error) {
      console.error("Add to cart error:", error);

      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to add product to cart",
      });
    }
  }

  // PUT /api/cart/items/:id
  async updateCartItem(
    req: Request,
    res: Response,
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const cartItemId =
        Number(req.params.id);

      const { quantity } = req.body;

      if (Number.isNaN(cartItemId)) {
        return res.status(400).json({
          message: "Invalid cart item ID",
        });
      }

      if (quantity === undefined) {
        return res.status(400).json({
          message: "Quantity is required",
        });
      }

      const item =
        await cartService.updateCartItem(
          req.user.id,
          cartItemId,
          Number(quantity),
        );

      return res.status(200).json({
        message: "Cart item updated successfully",
        item,
      });
    } catch (error) {
      console.error(
        "Update cart item error:",
        error,
      );

      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to update cart item",
      });
    }
  }

  // DELETE /api/cart/items/:id
  async removeFromCart(
    req: Request,
    res: Response,
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const cartItemId =
        Number(req.params.id);

      if (Number.isNaN(cartItemId)) {
        return res.status(400).json({
          message: "Invalid cart item ID",
        });
      }

      const result =
        await cartService.removeFromCart(
          req.user.id,
          cartItemId,
        );

      return res.status(200).json(result);
    } catch (error) {
      console.error(
        "Remove cart item error:",
        error,
      );

      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to remove cart item",
      });
    }
  }

  // DELETE /api/cart
  async clearCart(
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
        await cartService.clearCart(
          req.user.id,
        );

      return res.status(200).json(result);
    } catch (error) {
      console.error(
        "Clear cart error:",
        error,
      );

      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to clear cart",
      });
    }
  }
}