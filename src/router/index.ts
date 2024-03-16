import { Router } from "express";
import { userRouter } from "./user.route";
import { taskRouter } from "./task.route";

export const mainRouter = Router();

mainRouter.use("/auth",userRouter)
mainRouter.use("/user",taskRouter)