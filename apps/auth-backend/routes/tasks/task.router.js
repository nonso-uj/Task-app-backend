import express from "express";
import { CreateTask, DeleteTask, GetTasks, UpdateTask } from "./task.controller.js";
import { authUser } from "../../utils/AuthMiddleware.js";

const taskRouter = express.Router();

taskRouter.get("/", authUser, GetTasks);
taskRouter.post("/", authUser, CreateTask);
taskRouter.patch("/:taskId", authUser, UpdateTask);
taskRouter.delete("/:taskId", authUser, DeleteTask);

export default taskRouter;
