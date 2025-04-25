import express from "express";
import cors from "cors";
import { PORT } from "./config";
import rootroutes from "./router/index";

const port = PORT || 4000;
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("bookbyte home");
});

app.use("/api", rootroutes);

app.listen(port, () => {
  console.log("Server is running at 3000 ");
});
