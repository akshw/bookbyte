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
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get("/", (req, res) => {
    res.send("book home");
});
router.get("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //pagination
    try {
        const data = yield prisma.book.findMany();
        res.json(data);
    }
    catch (error) {
        console.log(error);
    }
}));
router.get("/books/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = "";
        const data = yield prisma.book.findUnique({ where: { id } });
        res.json(data);
    }
    catch (error) {
        console.log(error);
    }
}));
router.post("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminData = req.body;
        const email = adminData.email;
        const password = adminData.password;
        const validate = yield prisma.admin.findUnique({
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
    }
    catch (error) {
        console.log(error);
    }
}));
// router.get("/reviews?bookId=", async (req, res) => {
//   res.send();
// });
router.post("/reviews", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send();
}));
router.get("/refine", (req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
exports.default = router;
