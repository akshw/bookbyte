"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigninBody = exports.SignupBody = void 0;
const zod_1 = require("zod");
exports.SignupBody = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email format" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
    })
        .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
    })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    name: zod_1.z
        .string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(50),
});
exports.SigninBody = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email format" }),
    password: zod_1.z.string().min(1, { message: "Password is required" }),
});
