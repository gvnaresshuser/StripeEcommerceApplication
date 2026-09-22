import AppDataSource from "../config/database.js";
import { Product } from "../entities/Product.js";

export class ProductRepository {
  private repository = AppDataSource.getRepository(Product);

  // CREATE
  async createProduct(productData: Partial<Product>): Promise<Product> {
    const product = this.repository.create(productData);

    return await this.repository.save(product);
  }

  // READ ALL
  async findAll(): Promise<Product[]> {
    return await this.repository.find({
      order: {
        createdAt: "DESC",
      },
    });
  }

  // READ ONE
  async findById(id: number): Promise<Product | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  // UPDATE
  async updateProduct(
    id: number,
    productData: Partial<Product>,
  ): Promise<Product | null> {
    const product = await this.findById(id);

    if (!product) {
      return null;
    }

    Object.assign(product, productData);

    return await this.repository.save(product);
  }

  // DELETE
  async deleteProduct(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);

    return result.affected !== 0;
  }
}