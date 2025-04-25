import express from "express";
import { PrismaClient } from "@prisma/client";
import { GEMINI_API_KEY } from "../config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import authMiddleware from "../middleware";
import { AuthRequest } from "../types";

const router = express.Router();

const prisma = new PrismaClient();

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

router.get("/", (req, res) => {
  res.send("book home");
});

router.get("/books", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const books = await prisma.book.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: "asc" },
    });

    const total = await prisma.book.count();

    res.json({
      data: books,
      page,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

//@ts-ignore
router.get("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Book ID is required",
      });
    }

    const book = await prisma.book.findUnique({
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
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to fetch book",
    });
  }
});

//@ts-ignore
router.post("/book", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { book } = req.body;
    // @ts-ignore
    const adminId = req.userId?.userId;

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

    const admin = await prisma.admin.findUnique({
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

    const newBook = await prisma.book.create({
      data: bookData,
    });

    res.status(201).json({
      success: true,
      data: newBook,
      message: "Book added successfully",
    });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to add book",
    });
  }
});

//@ts-ignore
router.get("/reviews", async (req, res) => {
  try {
    const { bookId } = req.query;

    if (!bookId || typeof bookId !== "string") {
      return res.status(400).json({
        success: false,
        error: "Missing book ID",
        message: "Please provide a valid book ID",
      });
    }

    const book = await prisma.book.findUnique({
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
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to fetch reviews",
    });
  }
});

// @ts-ignore
router.post("/reviews", authMiddleware, async (req, res) => {
  try {
    const { reviewText, rating, bookId } = req.body;
    // @ts-ignore
    const userId = req.userId?.userId;

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

    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
        message: "The specified book does not exist",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        message: "The specified user does not exist",
      });
    }

    const newReview = await prisma.review.create({
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
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to add review",
    });
  }
});

// @ts-ignore
router.get("/refine", authMiddleware, async (req, res) => {
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

    const result = await model.generateContent(prompt);
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
  } catch (error) {
    console.error("Error refining review:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to refine review",
    });
  }
});

export default router;
