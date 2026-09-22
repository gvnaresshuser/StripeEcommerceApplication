import "reflect-metadata";
import bcrypt from "bcrypt";

import AppDataSource from "../config/database.js";
import { User } from "../entities/User.js";

const ADMIN_EMAIL = "admin@ecommerce.com";
const ADMIN_PASSWORD = "Admin@12345";

const seedAdmin = async () => {
  try {
    await AppDataSource.initialize();

    console.log("Database connected");

    const userRepository =
      AppDataSource.getRepository(User);

    const existingAdmin = await userRepository.findOne({
      where: {
        email: ADMIN_EMAIL,
      },
    });

    if (existingAdmin) {
      console.log("Admin user already exists");

      await AppDataSource.destroy();
      return;
    }

    const hashedPassword = await bcrypt.hash(
      ADMIN_PASSWORD,
      10,
    );

    const admin = userRepository.create({
      name: "Admin User",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
    });

    await userRepository.save(admin);

    console.log("Admin user created successfully");
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Role: ${admin.role}`);

    await AppDataSource.destroy();
  } catch (error) {
    console.error("Admin seed error:", error);

    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }

    process.exit(1);
  }
};

seedAdmin();