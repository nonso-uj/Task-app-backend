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

authUserRouter.post("/register", RegisterUser);
authUserRouter.post("/google", RegisterGoogleUser);
authUserRouter.post("/login", LoginUser);
authUserRouter.post("/refresh-token", RefreshToken);
authUserRouter.post("/forgot-password", sendResetToken);
authUserRouter.post("/set-new-password", resetPassword);

export default authUserRouter;
