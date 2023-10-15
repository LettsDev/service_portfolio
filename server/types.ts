import { Types } from "mongoose";

export class ExtendedError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "ExtendedError";
    this.statusCode = statusCode || 404;
  }
}

export interface ILocation {
  name: string;
}

export interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  auth: "USER" | "ENHANCED" | "ADMIN";
  validatePassword(password: string): Promise<boolean>;
}

export interface IResource {
  name: string;
  location: Types.ObjectId;
  created_by: Types.ObjectId;
  notes?: string;
}

export interface ISession {
  user: Types.ObjectId;
  valid: boolean;
  userAgent: string;
}

export interface IService {
  name: string;
  resource: Types.ObjectId;
  created_by: Types.ObjectId;
  start_date: Date;
  completion_date: Date;
  interval: number;
  frequency: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY" | "ANNUALLY";
}

export interface IServiceEventException {
  service: Types.ObjectId;
  exception_date: Date;
  is_cancelled: boolean;
  is_rescheduled: boolean;
  start_date: Date;
  created_by: Types.ObjectId;
}
