import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../services/UserService.js";

interface JwtPayload {
  userId: number;
}

const userService = new UserService();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Read JWT from HttpOnly cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // 2. Verify JWT
    const decoded = jwt.verify(
      token,
      JWT_SECRET,
    ) as JwtPayload;

    // 3. Find user
    const user = await userService.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // 4. Attach user to request
    req.user = user;

    // 5. Continue
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};