import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("user home");
});

router.get("/user/:id", (req, res) => {});

router.put("/user/:id", (req, res) => {});

export default router;
