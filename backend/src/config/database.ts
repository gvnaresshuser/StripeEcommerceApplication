import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",

  url: process.env.DATABASE_URL,

  schema: "ecommerce",

  ssl: {
    rejectUnauthorized: false,
  },

  synchronize: false,

  logging: false,

  entities: ["src/entities/**/*.ts"],

  migrations: ["src/migrations/**/*.ts"],
});

export default AppDataSource;