import { Request, Response } from "express";
import { ProductService } from "../services/ProductService.js";

const productService = new ProductService();

export class ProductController {
  // CREATE
  async createProduct(req: Request, res: Response) {
    try {
      const {
        name,
        description,
        price,
        stock,
        imageUrl,
        category,
      } = req.body;

      const product = await productService.createProduct({
        name,
        description,
        price,
        stock,
        imageUrl,
        category,
      });

      return res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.error("Create product error:", error);

      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to create product",
      });
    }
  }

  // READ ALL
  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await productService.getAllProducts();

      return res.status(200).json({
        products,
      });
    } catch (error) {
      console.error("Get products error:", error);

      return res.status(500).json({
        message: "Unable to retrieve products",
      });
    }
  }

  // READ ONE
  async getProductById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }

      const product =
        await productService.getProductById(id);

      return res.status(200).json({
        product,
      });
    } catch (error) {
      console.error("Get product error:", error);

      return res.status(404).json({
        message:
          error instanceof Error
            ? error.message
            : "Product not found",
      });
    }
  }

  // UPDATE
  async updateProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }

      const product =
        await productService.updateProduct(
          id,
          req.body,
        );

      return res.status(200).json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.error("Update product error:", error);

      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to update product",
      });
    }
  }

  // DELETE
  async deleteProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }

      const result =
        await productService.deleteProduct(id);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Delete product error:", error);

      return res.status(404).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete product",
      });
    }
  }
}