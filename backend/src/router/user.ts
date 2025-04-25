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
      userToken: token,
      user: {
        id: newUser.id,
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
      userToken: token,
      user: {
        id: user.id,
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

//@ts-ignore
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//@ts-ignore
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//@ts-ignore
router.post("/admin/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, password, and name are required" });
    }

    const existingAdmin = await prisma.admin.findFirst({
      where: { email: email },
    });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    const token = jwt.sign({ userId: newAdmin.id }, JWT_SECRET as string, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "Admin created successfully",
      adminToken: token,
      user: {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
      },
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//@ts-ignore
router.post("/admin/signin", async (req, res) => {
  try {
    const validatedData = SigninBody.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validatedData.error.errors,
      });
    }

    const { email, password } = validatedData.data;

    const admin = await prisma.admin.findFirst({
      where: { email },
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: admin.id }, JWT_SECRET as string, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Admin signin successful",
      adminToken: token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error("Admin signin error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
