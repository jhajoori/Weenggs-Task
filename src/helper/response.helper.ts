import { ErrorResponse, SuccessResponse } from "../interface/index.interface";

export const createErrorResponse = (type: string, message: string): ErrorResponse => {
    return {
      error: {
        type,
        message
      }
    };
  };
  
  export const createInternalServerErrorResponse = (): ErrorResponse => {
    return {
      error: {
        type: "Internal Server Error",
        message: "Something went wrong!"
      }
    };
  };
  
  export const createSuccessResponse = <T>(message: string, data?: T): SuccessResponse<T> => {
    return {
      success: true,
      message,
      data
    };
  };