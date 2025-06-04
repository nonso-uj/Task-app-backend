import Joi from "joi";
import Task from "../models/Task.js";
import { Types } from "mongoose";

export const GetTasks = async (req, res) => {
  const userId = req.user.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const startIndex = (page - 1) * limit;
  const total = await Task.countDocuments();

  try {
    const tasks = await Task.find({ user_id: new Types.ObjectId(`${userId}`) })
      .skip(startIndex)
      .limit(limit);
    res.status(201).json({
      success: true,
      message: "Successfull",
      tasks: tasks,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log("Error getting task: ", error);
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: `${error}`,
    });
  }
};

export const CreateTask = async (req, res) => {
  const userId = req.user.userId;

  const validateRequest = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Task name is required",
      "any.required": "Task name is required",
    }),
  });

  const { error } = validateRequest.validate(req.body);
  if (error) {
    const [{ message }] = error.details;
    return res.status(400).json({
      success: false,
      error: message,
    });
  }

  try {
    const newTask = new Task({
      ...req.body,
      user_id: new Types.ObjectId(`${userId}`),
    });
    await newTask.save();
    const tasks = await Task.find({ user_id: new Types.ObjectId(`${userId}`) });
    res.status(201).json({
      success: true,
      message: "New task created successfully",
      tasks: tasks,
    });
  } catch (error) {
    console.log("Error creating task: ", error);
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: `${error}`,
    });
  }
};

export const UpdateTask = async (req, res) => {
  const userId = req.user.userId;
  const taskId = req.params.taskId;

  try {
    const task = await Task.findById(taskId);
    task.status = req.body.status;
    await task.save();

    const tasks = await Task.find({ user_id: new Types.ObjectId(`${userId}`) });
    res.status(201).json({
      success: true,
      message: "Task updated successfully",
      tasks: tasks,
    });
  } catch (error) {
    console.log("Error updating task: ", error);
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: `${error}`,
    });
  }
};

export const DeleteTask = async (req, res) => {
  const userId = req.user.userId;
  const taskId = req.params.taskId;

  try {
    await Task.findByIdAndDelete(taskId);

    const tasks = await Task.find({ user_id: new Types.ObjectId(`${userId}`) });
    res.status(201).json({
      success: true,
      message: "Task deleted successfully",
      tasks: tasks,
    });
  } catch (error) {
    console.log("Error deleting task: ", error);
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: `${error}`,
    });
  }
};
