import { ProductRepository } from "../repositories/ProductRepository.js";

interface CreateProductData {
  name: string;
  description?: string;
  price: string;
  stock?: number;
  imageUrl?: string;
  category?: string;
}

interface UpdateProductData {
  name?: string;
  description?: string;
  price?: string;
  stock?: number;
  imageUrl?: string;
  category?: string;
}

export class ProductService {
  private productRepository = new ProductRepository();

  // CREATE
  async createProduct(productData: CreateProductData) {
    const {
      name,
      description,
      price,
      stock,
      imageUrl,
      category,
    } = productData;

    // Basic business validation
    if (!name || name.trim().length === 0) {
      throw new Error("Product name is required");
    }

    if (!price || Number(price) <= 0) {
      throw new Error("Product price must be greater than 0");
    }

    if (stock !== undefined && stock < 0) {
      throw new Error("Product stock cannot be negative");
    }

    const product = await this.productRepository.createProduct({
      name: name.trim(),
      description,
      price,
      stock: stock ?? 0,
      imageUrl,
      category,
    });

    return product;
  }

  // READ ALL
  async getAllProducts() {
    return await this.productRepository.findAll();
  }

  // READ ONE
  async getProductById(id: number) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  // UPDATE
  async updateProduct(
    id: number,
    productData: UpdateProductData,
  ) {
    // Make sure product exists
    const existingProduct =
      await this.productRepository.findById(id);

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Validate price if supplied
    if (
      productData.price !== undefined &&
      Number(productData.price) <= 0
    ) {
      throw new Error("Product price must be greater than 0");
    }

    // Validate stock if supplied
    if (
      productData.stock !== undefined &&
      productData.stock < 0
    ) {
      throw new Error("Product stock cannot be negative");
    }

    // Trim name if supplied
    if (productData.name !== undefined) {
      productData.name = productData.name.trim();

      if (!productData.name) {
        throw new Error("Product name cannot be empty");
      }
    }

    const updatedProduct =
      await this.productRepository.updateProduct(
        id,
        productData,
      );

    return updatedProduct;
  }

  // DELETE
  async deleteProduct(id: number) {
    const existingProduct =
      await this.productRepository.findById(id);

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    await this.productRepository.deleteProduct(id);

    return {
      message: "Product deleted successfully",
    };
  }
}