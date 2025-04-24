import express from "express";
import user from "./user";
import book from "./book";

const router = express.Router();

router.use("/user", user);
router.use("/book", book);

export default router;
