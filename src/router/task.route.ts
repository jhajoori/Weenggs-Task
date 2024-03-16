import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { validator } from "../validator/schema.validator";
import {
  addTask,
  deleteTask,
  getAllTask,
  getTaskById,
  updateTask,
} from "../controller/task.controller";

export const taskRouter = Router();

// Working & made as In SWAGGER UI

// ○ GET /tasks: Get all tasks with pagination support.
taskRouter.get("/tasks", authMiddleware, getAllTask);

// ○ GET /tasks/:id: Get a specific task by ID.
taskRouter.get("/task/:id", authMiddleware, getTaskById);

// ○ POST /tasks: Create a new task with request data validation.
taskRouter.post("/task", validator("addTask"), authMiddleware, addTask);

// ○ PATCH /tasks/:id: Update a task with request data validation.
taskRouter.patch("/task/edit/:id", validator("updateTask"), authMiddleware, updateTask);

// ○ DELETE /tasks/:id: Delete a task. (Soft deleted)
taskRouter.delete("/tasks/:id", authMiddleware, deleteTask);



// NOTE:  Below ROUTE is as per requiment/Documentation and working in POSTMAN but "PATCH" & "GET" are not showing in SWAGGER UI.
// You can check in postman by uncommenting below route and commenting upper route code.

// taskRouter.get("/tasks", authMiddleware, getAllTask);
// taskRouter.get("/tasks/:id", authMiddleware, getTaskById);
// taskRouter.post("/tasks", validator("addTask"), authMiddleware, addTask);
// taskRouter.patch("/tasks/:id", validator("updateTask"), authMiddleware, updateTask);
// taskRouter.delete("/tasks/:id", authMiddleware, deleteTask);

