import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { createErrorResponse } from "../helper/response.helper";

const schemas = {
  register: Joi.object({
    email: Joi.string().required().email().messages({
      "any.required": "Email is required!",
      "string.email": "Email should be valid email address!",
    }),
    password: Joi.string().required().min(6).messages({
      "any.required": "Password is required!",
      "string.min": "Password should be of minimun 6 characters",
    }),
    role: Joi.optional(),
  }),

  login: Joi.object({
    email: Joi.string().required().email().messages({
      "any.required": "Email is required!",
      "string.email": "Email should be valid email address!",
    }),
    password: Joi.string().required().min(6).messages({
      "any.required": "Password is required!",
      "string.min": "Password should be of minimun 6 characters",
    }),
  }),

  addTask : Joi.object({
    title: Joi.string().required().min(4).messages({
      "any.required": "Title is required!",
      "string.min": "Title should be of minimun 6 character",
    }),
    description: Joi.string().required().min(6).max(1000).messages({
      "any.required": "Description is required!",
      "string.min": "Description should be of minimun 6 character",
      "string.max": "Description should not exceed 1000 characters",
    }),
  }),

  updateTask : Joi.object({
    title: Joi.string().required().min(4).messages({
      "any.required": "Title is required!",
      "string.min": "Title should be of minimun 6 character",
    }),
    description: Joi.string().required().min(6).max(1000).messages({
      "any.required": "Description is required!",
      "string.min": "Description should be of minimun 6 character",
      "string.max": "Description should not exceed 1000 characters",
    }),

    status: Joi.string().valid("completed", "cancelled", "pending").required().messages({
      "any.required": "Status is required!",
      "any.only": "Status must be one of 'completed', 'cancelled', or 'pending'",
    }),
  }),

  
};

export const validator = (schemaKey: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schemas[schemaKey].validate(req.body);

    console.log(error);

    if (error) {
      const message = error.details.map((err) => err.message).join(", ");

      return res.status(400).send(createErrorResponse("Invalid", message));
    }
    next();
  };
};


