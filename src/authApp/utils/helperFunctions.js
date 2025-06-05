import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateResetToken = async () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const resetExpires = new Date(Date.now() + 3600000);
  return { resetToken, hashedToken, resetExpires };
};

export const signJwtToken = (userId, timeFrame, token) => {
  return jwt.sign({ userId: userId }, token === 'access' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: timeFrame,
  });
};
