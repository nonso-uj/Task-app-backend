import express from "express";
import {
  CreateTask,
  DeleteTask,
  GetTasks,
  UpdateTask,
} from "./task.controller.js";
import { authUser } from "../../authApp/utils/AuthMiddleware.js";
import rateLimiterMiddleware from "../../utils/middleware.js";

const taskRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - user_id
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated id of the task
 *         user_id:
 *           type: string
 *           description: Id of the user who created the task
 *         name:
 *           type: string
 *           description: Name of the task
 *         status:
 *           type: boolean
 *           description: Status of the task
 *       example:
 *         name: An example task
 */

/**
 * @swagger
 * tags:
 *  name: Tasks
 *  description: The tasks managing API
 */

/**
 * @swagger
 * /task-backend/task:
 *  get:
 *    summary: Returns list of all tasks
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      201:
 *        description: The list of all tasks
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Task'
 */
taskRouter.get("/", authUser, GetTasks);

/**
 * @swagger
 * /task-backend/task:
 *  post:
 *    summary: Create new task
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Task'
 *    responses:
 *      201:
 *        description: New task created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Task'
 *      400:
 *        description: Something went wrong
 */
taskRouter.post("/", authUser, rateLimiterMiddleware, CreateTask);

/**
 * @swagger
 * /task-backend/task/{_id}:
 *  patch:
 *    summary: Update a task
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: _id
 *        schema:
 *          type: string
 *        required: true
 *        description: The task id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              status:
 *                type: boolean
 *                default: true
 *    responses:
 *      201:
 *        description: Task updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Task'
 *      404:
 *        description: Task not found!
 *      400:
 *        description: Something went wrong
 */
taskRouter.patch("/:taskId", authUser, rateLimiterMiddleware, UpdateTask);

/**
 * @swagger
 * /task-backend/task/{_id}:
 *  delete:
 *    summary: Delete a task
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: _id
 *        schema:
 *          type: string
 *        required: true
 *        description: The task id
 *    responses:
 *      201:
 *        description: Task deleted successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *      404:
 *        description: Task not found!
 *      400:
 *        description: Something went wrong
 */
taskRouter.delete("/:taskId", authUser, rateLimiterMiddleware, DeleteTask);

export default taskRouter;
