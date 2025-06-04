import express from "express";
import {
  LoginUser,
  RefreshToken,
  RegisterGoogleUser,
  RegisterUser,
  resetPassword,
  sendResetToken,
} from "./authUser.controller.js";

const authUserRouter = express.Router();

/**
 * @swagger
 * tags:
 *  name: Authentication
 */

/**
 * @swagger
 * /auth-backend/auth/login:
 *   post:
 *     summary: Login to get JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: user.test@email.com
 *               password:
 *                 type: string
 *                 default: test@Us3r
 *     responses:
 *       200:
 *         description: Returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */

authUserRouter.post("/register", RegisterUser);
authUserRouter.post("/google", RegisterGoogleUser);
authUserRouter.post("/login", LoginUser);
authUserRouter.post("/refresh-token", RefreshToken);
authUserRouter.post("/forgot-password", sendResetToken);
authUserRouter.post("/set-new-password", resetPassword);

export default authUserRouter;
