import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { register, login } from "./auth.service";
import { AppError } from "../../utils/app-error";
import { success } from "../../utils/api-response";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      throw AppError.badRequest(parsed.error.errors[0].message);
    }
    const result = await register(parsed.data);
    success(res, result, 201);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw AppError.badRequest(parsed.error.errors[0].message);
    }
    const result = await login(parsed.data);
    success(res, result);
  } catch (err) {
    next(err);
  }
});

export default router;
