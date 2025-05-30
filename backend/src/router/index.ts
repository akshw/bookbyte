import express from "express";
import user from "./user";
import book from "./book";

const router = express.Router();

router.use("/user", user);
router.use("/lib", book);

export default router;
