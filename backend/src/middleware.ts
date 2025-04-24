import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("no header");
    return res.status(401).json({
      msg: "authorization token is required",
    });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    // @ts-ignore
    req.userId = {
      userId: (decoded as jwt.JwtPayload).userId,
    };
    next();
  } catch (error) {
    console.log("decode failed");
    console.log(error);
    res.status(400).json({
      msg: "authorization failed",
    });
  }
}

export default authMiddleware;
