import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authUser = (req, res, next) => {
  console.log("authing!!!");
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Invalid Token, please logout and log back in to continue!",
    });
  }
};
