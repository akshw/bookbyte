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
const config_1 = require("../config");
const generative_ai_1 = require("@google/generative-ai");
const middleware_1 = __importDefault(require("../middleware"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const genAI = new generative_ai_1.GoogleGenerativeAI(config_1.GEMINI_API_KEY);
router.get("/", (req, res) => {
    res.send("book home");
});
router.get("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const books = yield prisma.book.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { id: "asc" },
        });
        const total = yield prisma.book.count();
        res.json({
            data: books,
            page,
            total,
            pages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch books" });
    }
}));
//@ts-ignore
router.get("/book/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Bad Request",
                message: "Book ID is required",
            });
        }
        const book = yield prisma.book.findUnique({
            where: { id },
        });
        if (!book) {
            return res.status(404).json({
                success: false,
                error: "Not Found",
                message: `Book with ID ${id} not found`,
            });
        }
        res.json({
            success: true,
            data: book,
        });
    }
    catch (error) {
        console.error("Error fetching book by ID:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "Failed to fetch book",
        });
    }
}));
//@ts-ignore
router.post("/book", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { book } = req.body;
        // @ts-ignore
        const adminId = (_a = req.userId) === null || _a === void 0 ? void 0 : _a.userId;
        if (!book || !book.name || !book.imageUrl) {
            return res.status(400).json({
                success: false,
                error: "Bad Request",
                message: "Book name and imageUrl are required",
            });
        }
        if (!adminId) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
                message: "Admin authentication required",
            });
        }
        const admin = yield prisma.admin.findUnique({
            where: { id: adminId },
        });
        if (!admin) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
                message: "Admin authentication required",
            });
        }
        const bookData = {
            name: book.name,
            imageUrl: book.imageUrl,
            author: book.author || null,
            genre: book.genre || null,
            description: book.description || null,
            adminId,
        };
        const newBook = yield prisma.book.create({
            data: bookData,
        });
        res.status(201).json({
            success: true,
            data: newBook,
            message: "Book added successfully",
        });
    }
    catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "Failed to add book",
        });
    }
}));
//@ts-ignore
router.get("/reviews", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.query;
        if (!bookId || typeof bookId !== "string") {
            return res.status(400).json({
                success: false,
                error: "Missing book ID",
                message: "Please provide a valid book ID",
            });
        }
        const book = yield prisma.book.findUnique({
            where: { id: bookId },
            include: {
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        id: "desc",
                    },
                },
            },
        });
        if (!book) {
            return res.status(404).json({
                success: false,
                error: "Book not found",
                message: "The specified book does not exist",
            });
        }
        res.status(200).json({
            success: true,
            data: {
                book: {
                    id: book.id,
                    name: book.name,
                    imageUrl: book.imageUrl,
                    author: book.author,
                    genre: book.genre,
                },
                reviews: book.reviews,
            },
            message: "Reviews retrieved successfully",
        });
    }
    catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "Failed to fetch reviews",
        });
    }
}));
// @ts-ignore
router.post("/reviews", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { reviewText, rating, bookId } = req.body;
        // @ts-ignore
        const userId = (_a = req.userId) === null || _a === void 0 ? void 0 : _a.userId;
        console.log(userId);
        if (!userId || !bookId) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
                message: "User ID and Book ID are required",
            });
        }
        if (rating == undefined && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                success: false,
                error: "Invalid rating",
                message: "Rating must be between 1 and 5",
            });
        }
        const book = yield prisma.book.findUnique({
            where: { id: bookId },
        });
        if (!book) {
            return res.status(404).json({
                success: false,
                error: "Book not found",
                message: "The specified book does not exist",
            });
        }
        const user = yield prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
                message: "The specified user does not exist",
            });
        }
        const newReview = yield prisma.review.create({
            data: {
                reviewText: reviewText || null,
                rating: rating,
                userId: userId,
                bookId: bookId,
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            data: newReview,
            message: "Review added successfully",
        });
    }
    catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "Failed to add review",
        });
    }
}));
// @ts-ignore
router.get("/refine", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.query.review || typeof req.query.review !== "string") {
            return res.status(400).json({
                success: false,
                error: "Missing review text",
                message: "Please provide a review text to refine",
            });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = `Please improve this review by:
    1. Fixing any grammar or spelling errors
    2. Enhancing clarity and readability
    3. Maintaining the original sentiment and meaning
    4. Making the tone more professional and engaging

    Review: ${req.query.review}

    Provide only the refined review text without any additional comments or explanations.`;
        const result = yield model.generateContent(prompt);
        const response = result.response;
        const refinedReview = response.text();
        res.status(200).json({
            success: true,
            data: {
                originalReview: req.query.review,
                refinedReview: refinedReview,
            },
            message: "Review refined successfully",
        });
    }
    catch (error) {
        console.error("Error refining review:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "Failed to refine review",
        });
    }
}));
exports.default = router;
