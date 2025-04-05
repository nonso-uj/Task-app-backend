import express from "express"
import { LoginUser, RegisterUser, resetPassword, sendResetToken } from "./authUser.controller.js";

const authUserRouter = express.Router();

authUserRouter.post('/register', RegisterUser);
authUserRouter.post('/login', LoginUser);
authUserRouter.post('/forgot-password', sendResetToken);
authUserRouter.post('/set-new-password', resetPassword);

export default authUserRouter;