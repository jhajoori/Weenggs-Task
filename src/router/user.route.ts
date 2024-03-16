import { Router } from "express";
import { validator } from "../validator/schema.validator";
import { login, register } from "../controller/user.controller";

export const userRouter = Router();

userRouter.post("/register", validator("register"), register);
userRouter.post("/login", validator("login"), login);
