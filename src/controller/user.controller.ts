import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../datasource";
import { User } from "../entity/user.entity";
import {
  createErrorResponse,
  createInternalServerErrorResponse,
  createSuccessResponse,
} from "../helper/response.helper";
import * as dotenv from "dotenv";
import { Role } from "../helper/state.enum";
dotenv.config();

const UserRepository = AppDataSource.getRepository(User);

//register User

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    const isEmailExist = await UserRepository.findOneBy({ email });

    if (isEmailExist)
      return res
        .status(400)
        .json(createErrorResponse("Invalid", "Email already exist!"));

    let userRole = Role.USER;

    if (role) userRole = role === "admin" ? Role.ADMIN : Role.USER;

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const newUser = await UserRepository.save({
      email,
      password: hashedPassword,
      role: userRole,
    });

    const token = jwt.sign({ id: newUser.id }, process.env.SECRET, {
      expiresIn: "1h",
    });

    return res
      .status(201)
      .json(createSuccessResponse("User registered successfully!", { token }));
  } catch (error) {
    console.log("error => ", error);
    return res.status(500).json(createInternalServerErrorResponse());
  }
};

// User login method
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });

    if (!user)
      return res
        .status(400)
        .json(createErrorResponse("Invalid", "Invalid email provided!"));

    if (!bcrypt.compareSync(password, user.password))
      return res
        .status(400)
        .json(createErrorResponse("Invalid", "Invalid password!"));

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .json(createSuccessResponse("Data fetched successfully!", { token }));
  } catch (error) {
    console.log("error => ", error);
    return res.status(500).json(createInternalServerErrorResponse());
  }
};
