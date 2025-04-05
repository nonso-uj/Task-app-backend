import express from "express"
import authUserRouter from "./routes/authUser/authUser.router.js";
import taskRouter from "./routes/tasks/task.router.js";

const authAppRouter = express.Router();


authAppRouter.use('/auth', authUserRouter);
authAppRouter.use('/task', taskRouter);



export default authAppRouter;