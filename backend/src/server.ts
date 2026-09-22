import "reflect-metadata";

import dotenv from "dotenv";

import app from "./app.js";
import AppDataSource from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    console.log("PostgreSQL database connected successfully");

    app.listen(PORT, () => {
      console.log(
        `Server running at http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });