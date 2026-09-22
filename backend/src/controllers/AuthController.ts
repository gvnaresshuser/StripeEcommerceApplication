import { Request, Response } from "express";
import { UserService } from "../services/UserService.js";
import { generateToken } from "../utils/jwt.js";

const userService = new UserService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, mobile } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Name, email and password are required",
        });
      }

      const user = await userService.registerUser({
        name,
        email,
        password,
        mobile,
      });

      return res.status(201).json({
        message: "User registered successfully",
        user,
      });
    } catch (error) {
      console.error("Register error:", error);

      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to register user",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Basic validation
      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      // Authenticate user
      const user = await userService.loginUser({
        email,
        password,
      });

      // Generate JWT
      const token = generateToken(user.id);

      // Store JWT in HttpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: "Login successful",
        user,
      });
    } catch (error) {
      console.error("Login error:", error);

      return res.status(401).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to login",
      });
    }
  }

  async me(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { password: _, ...safeUser } = req.user;

    return res.status(200).json({
      user: safeUser,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Unable to get current user",
    });
  }
}

async logout(req: Request, res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Logout successful",
  });
}
}

