import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", (req, res) => {
  res.send("book home");
});

router.get("/books", async (req, res) => {
  //pagination
  try {
    const data = await prisma.book.findMany();
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/books/:id", async (req, res) => {
  try {
    const id = "";
    const data = await prisma.book.findUnique({ where: { id } });
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.post("/books", async (req, res) => {
  try {
    const adminData = req.body;
    const email: string = adminData.email;
    const password: string = adminData.password;
    const validate = await prisma.admin.findUnique({
      //@ts-ignore
      where: { email, password },
    });
    // if(validate){
    //     await prisma.admin.update({
    //         data: {
    //             email,
    //             password,
    //             name:
    //         }
    //     })
  } catch (error) {
    console.log(error);
  }
});

// router.get("/reviews?bookId=", async (req, res) => {
//   res.send();
// });

router.post("/reviews", async (req, res) => {
  res.send();
});

router.get("/refine", async (req, res) => {});

export default router;
