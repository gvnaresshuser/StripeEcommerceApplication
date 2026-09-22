import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const AppDataSource = new DataSource({
  type: "postgres",

  url: process.env.DATABASE_URL,

  schema: "ecommerce",

  ssl: {
    rejectUnauthorized: false,
  },

  synchronize: false,

  logging: false,

  entities: [
    isProduction
      ? "dist/entities/**/*.js"
      : "src/entities/**/*.ts",
  ],

  migrations: [
    isProduction
      ? "dist/migrations/**/*.js"
      : "src/migrations/**/*.ts",
  ],
});

export default AppDataSource;