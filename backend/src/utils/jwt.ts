import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export const generateToken = (userId: number): string => {
  return jwt.sign(
    {
      userId,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
};