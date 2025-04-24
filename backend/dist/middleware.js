"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("no header");
        return res.status(401).json({
            msg: "authorization token is required",
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        // @ts-ignore
        req.userId = {
            userId: decoded.userId,
        };
        next();
    }
    catch (error) {
        console.log("decode failed");
        console.log(error);
        res.status(400).json({
            msg: "authorization failed",
        });
    }
}
exports.default = authMiddleware;
