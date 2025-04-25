"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const middleware_1 = __importDefault(require("../middleware"));
const config_1 = require("../config");
const types_1 = require("../types");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get("/", (req, res) => {
    res.send("user home");
});
//@ts-ignore
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = types_1.SignupBody.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: "Invalid input data",
                errors: validationResult.error.errors,
            });
        }
        const { email, password, name } = validationResult.data;
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, config_1.JWT_SECRET, {
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
}));
//@ts-ignore
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = types_1.SigninBody.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json({
                message: "Invalid input data",
                errors: validatedData.error.errors,
            });
        }
        const { email, password } = validatedData.data;
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.JWT_SECRET, {
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
    }
    catch (error) {
        console.error("Signin error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}));
//@ts-ignore
router.get("/:id", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = yield prisma.user.findUnique({
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
    }
    catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
//@ts-ignore
router.put("/:id", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const { name, email } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const updatedUser = yield prisma.user.update({
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
    }
    catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
//@ts-ignore
router.post("/admin/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res
                .status(400)
                .json({ message: "Email, password, and name are required" });
        }
        const existingAdmin = yield prisma.admin.findFirst({
            where: { email: email },
        });
        if (existingAdmin) {
            return res
                .status(400)
                .json({ message: "Admin with this email already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newAdmin = yield prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: newAdmin.id }, config_1.JWT_SECRET, {
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
    }
    catch (error) {
        console.error("Error creating admin:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
//@ts-ignore
router.post("/admin/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = types_1.SigninBody.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json({
                message: "Invalid input data",
                errors: validatedData.error.errors,
            });
        }
        const { email, password } = validatedData.data;
        const admin = yield prisma.admin.findFirst({
            where: { email },
        });
        if (!admin) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        const isValidPassword = yield bcrypt_1.default.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: admin.id }, config_1.JWT_SECRET, {
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
    }
    catch (error) {
        console.error("Admin signin error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}));
exports.default = router;
