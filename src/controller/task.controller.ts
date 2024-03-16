import { Request, Response } from "express";
import { AppDataSource } from "../datasource";
import {
  createErrorResponse,
  createInternalServerErrorResponse,
  createSuccessResponse,
} from "../helper/response.helper";
import { Task } from "../entity/task.entity";
import * as dotenv from "dotenv";
import { User } from "../entity/user.entity";
import { State } from "../helper/state.enum";
import {
  ErrorResponse,
  SuccessResponse,
  TaskListResponse,
} from "../interface/index.interface";
dotenv.config();

const TaskRepository = AppDataSource.getRepository(Task);

// Get all tasks with pagination support.
export const getAllTask = async (req: Request, res: Response) => {
  try {
    const { page, perPage } = req.query;
    const pageNumber = Number(page) || 1;
    const pageLimit = Number(perPage) || 10;
    const user: User = res.locals.token;

    const [tasks, count] = await TaskRepository.findAndCount({
      relations: { user: true },
      where: { is_active: true, user: { id: user.id } },
      skip: (pageNumber - 1) * pageLimit,
      take: pageLimit,
    });

    const pagination = {
      currentPage: +page,
      totalPage: Math.ceil(count / +perPage),
      total: count,
    };

    const responseData: TaskListResponse = {
      success: true,
      message: "Data fetched successfully!",
      data: { tasks, pagination },
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.log("error => ", error);
    const errorResponse: ErrorResponse = createInternalServerErrorResponse();
    res.status(500).json(errorResponse);
  }
};

//  Get a specific task by ID.
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      const errorResponse: ErrorResponse = createErrorResponse(
        "Invalid",
        "Task Id is required!"
      );
      return res.status(400).json(errorResponse);
    }

    const user: User = res.locals.token;

    const task = await TaskRepository.findOne({
      relations: { user: true },
      where: {
        id: Number(id),
        is_active: true,
        user: { id: user.id },
      },
    });

    if (!task) {
      const successResponse: SuccessResponse<null> = createSuccessResponse(
        "No data found!",
        null
      );
      return res.status(200).json(successResponse);
    }

    const responseData: SuccessResponse<Task> = createSuccessResponse(
      "Task fetched successfully!",
      task
    );
    return res.status(200).json(responseData);
  } catch (error) {
    console.log("error => ", error);
    const errorResponse: ErrorResponse = createInternalServerErrorResponse();
    res.status(500).json(errorResponse);
  }
};

// Create a new task with request data validation.
export const addTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const user: User = res.locals.token;
    const isExist = await TaskRepository.findOneBy({
      title,
      is_active: true,
      user: { id: user.id },
    });

    if (isExist) {
      const errorResponse: ErrorResponse = createErrorResponse(
        "Invalid",
        "Task already exists!"
      );
      return res.status(400).json(errorResponse);
    }

    const newTask = await TaskRepository.save({
      title,
      description,
      user,
    });


    const successResponse: SuccessResponse<Task> = createSuccessResponse(
      "Task added successfully!"
    );
    return res.status(200).json(successResponse);
  } catch (error) {
    console.log("error => ", error);
    const errorResponse: ErrorResponse = createInternalServerErrorResponse();
    return res.status(500).json(errorResponse);
  }
};

// Update a task with request data validation.
export const updateTask = async (req: Request, res: Response) => {
  try {
    let { title, description, status } = req.body;
    const { id } = req.params;

    const user: User = res.locals.token;

    const taskToUpdate = await TaskRepository.findOne({
      where: {
        id: +id,
        user: { id: user.id },
      },
    });

    if (!taskToUpdate) {
      const errorResponse: ErrorResponse = createErrorResponse(
        "Invalid",
        "Task not found!"
      );
      return res.status(404).json(errorResponse);
    }
    const taskStatus: State =
      status === State.COMPLETED
        ? State.COMPLETED
        : status === State.CANCELLED
        ? State.CANCELLED
        : State.PENDING;

    let taskCompletedAt: Date = new Date();

    if (taskStatus != State.COMPLETED || taskToUpdate.completed_at !== null)
      taskCompletedAt = null;


      console.log('taskStatus != State.COMPLETED || taskToUpdate.completed_at !== null :>> ', taskStatus != State.COMPLETED , taskToUpdate.completed_at !== null);

    const updatedTask = await TaskRepository.save({
      id: +id,
      title,
      description,
      completed_at: taskCompletedAt,
      status: taskStatus,
      user,
    });

    const successResponse: SuccessResponse<Task> = createSuccessResponse(
      "Task updated successfully!",
      updatedTask
    );
    return res.status(200).json(successResponse);
  } catch (error) {
    console.log("error => ", error);
    const errorResponse: ErrorResponse = createInternalServerErrorResponse();
    return res.status(500).json(errorResponse);
  }
};

// Delete a task. (Soft deleted)
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user: User = res.locals.token;

    const taskToDelete = await TaskRepository.findOne({
      where: {
        id: +id,
        user: { id: user.id },
      },
    });

    if (!taskToDelete) {
      const errorResponse: ErrorResponse = createErrorResponse(
        "Invalid",
        "Task not found!"
      );
      return res.status(404).json(errorResponse);
    }

    taskToDelete.is_active = false;
    await TaskRepository.save(taskToDelete);

    const successResponse: SuccessResponse<null> = createSuccessResponse(
      "Task deleted successfully!",
      null
    );
    return res.status(200).json(successResponse);
  } catch (error) {
    const errorResponse: ErrorResponse = createInternalServerErrorResponse();
    return res.status(500).json(errorResponse);
  }
};
