import jwt from "jsonwebtoken";
import env from "../config/env";
import { AppError } from "./app-error";

export function generateToken(payload: { userId: number }): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}
export function verifyToken(token: string): { userId: number } {
  try {
    return jwt.verify(token, env.JWT_SECRET) as { userId: number };
  } catch (error) {
    throw AppError.unauthorized();
  }
}
