import { z } from "zod";
import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const SignupBody = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50),
});

export const SigninBody = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password is required" }),
});
