import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcrypt";
import authMiddleware from "../middleware";
import { JWT_SECRET } from "../config";
import { SignupBody, SigninBody } from "../types";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", (req, res) => {
  res.send("user home");
});

//@ts-ignore
router.post("/signup", async (req, res) => {
  try {
    const validationResult = SignupBody.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validationResult.error.errors,
      });
    }

    const { email, password, name } = validationResult.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET as string, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

//@ts-ignore
router.post("/signin", async (req, res) => {
  try {
    const validatedData = SigninBody.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validatedData.error.errors,
      });
    }

    const { email, password } = validatedData.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Signin successful",
      token,
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/user/:id", (req, res) => {});

router.put("/user/:id", (req, res) => {});

export default router;
