import AppDataSource from "../config/database.js";
import { User } from "../entities/User.js";

export class UserRepository {
  private repository = AppDataSource.getRepository(User);

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);

    return await this.repository.save(user);
  }
}