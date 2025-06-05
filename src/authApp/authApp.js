import express from "express";
import authUserRouter from "./routes/authUser.router.js";

const authAppRouter = express.Router();

authAppRouter.use("/auth", authUserRouter);

export default authAppRouter;
