import express from "express";
import {
  CreateTask,
  DeleteTask,
  GetTasks,
  UpdateTask,
} from "./task.controller.js";
import { authUser } from "../../authApp/utils/AuthMiddleware.js";
import rateLimiterMiddleware from "../../generalUtils/middleware.js";

const taskRouter = express.Router();

taskRouter.get("/", authUser, GetTasks);
taskRouter.post("/", authUser, rateLimiterMiddleware, CreateTask);
taskRouter.patch("/:taskId", authUser, rateLimiterMiddleware, UpdateTask);
taskRouter.delete("/:taskId", authUser, rateLimiterMiddleware, DeleteTask);

export default taskRouter;
