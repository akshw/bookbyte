"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const index_1 = __importDefault(require("./router/index"));
const port = config_1.PORT || 4000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("bookbyte home");
});
app.use("/api", index_1.default);
app.listen(port, () => {
    console.log("Server is running at 3000 ");
});
console.log(port);
console.log("hii");
