import express from "express";
import taskRouter from "./routes/task.router.js";

const taskAppRouter = express.Router();

taskAppRouter.use("/task", taskRouter);

export default taskAppRouter;