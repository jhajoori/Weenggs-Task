import { Role, State } from "../helper/state.enum";

export interface Task {
    id: number;
    title: string;
    description: string;
    completed_at: Date | null;
    status: State;
    user: User;
  }
  
  export interface User {
    id: number;
    email: string;
    password: string;
    role: Role;
  }

  export interface ErrorResponse {
    error: {
      type: string;
      message: string;
    };
  }
  
  export interface SuccessResponse<T> {
    success: boolean;
    message: string;
    data?: T;
  }
  
  
  export interface PaginationMetadata {
    currentPage: number;
    totalPage: number;
    total: number;
  }
  
  export interface TaskListResponse {
    success: boolean;
    message: string;
    data: {
      tasks: Task[];
      pagination: PaginationMetadata;
    };
  }

