import { Request, Response, NextFunction } from "express";

export const requireRole = (requiredRole: string) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    // Authentication must happen first
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Check user's role
    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};