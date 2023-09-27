import { ILocation, IResource, IService, IUser } from "../../types";
import mongoose from "mongoose";
export const locations: ILocation[] = [
  { name: "YPW" },
  { name: "YVR" },
  { name: "YXS" },
];

export const users: Omit<
  IUser,
  "createdAt" | "updatedAt" | "validatePassword" | "sanitizePass"
>[] = [
  {
    first_name: "John",
    last_name: "Smith",
    email: "test@gmail.com",
    auth: "ADMIN",
    password: "65f073f6-1897-4f4c-a17b-d910d02fc5da",
  },
  {
    first_name: "John",
    last_name: "Smith",
    email: "tester@gmail.com",
    auth: "ENHANCED",
    password: "65f073f6-1897-4f4c-a17b-d910d02fc5da",
  },
  {
    first_name: "John",
    last_name: "Smith",
    email: "tested@gmail.com",
    auth: "USER",
    password: "65f073f6-1897-4f4c-a17b-d910d02fc5da",
  },
];

export const resources: IResource[] = [
  {
    name: "Golf Cart",
    location: new mongoose.Types.ObjectId(), // Replace with actual ObjectID
    created_by: new mongoose.Types.ObjectId(), // Replace with actual ObjectID
    notes: "this is a Golf Cart",
  },
  {
    name: "fuel truck",
    location: new mongoose.Types.ObjectId(), // Replace with actual ObjectID
    created_by: new mongoose.Types.ObjectId(), // Replace with actual ObjectID
    notes: "This is the fuel truck.",
  },
  {
    name: "mister",
    location: new mongoose.Types.ObjectId(), // Replace with actual ObjectID
    created_by: new mongoose.Types.ObjectId(), // Replace with actual ObjectID
    notes: "This is the mister.",
  },
];

export const services: IService[] = [
  {
    name: "Maintenance Service 1",
    resource: new mongoose.Types.ObjectId(),
    created_by: new mongoose.Types.ObjectId(),
    start_date: new Date("2023-09-01"),
    completion_date: new Date("2023-09-08"),
    interval: 7,
    frequency: "WEEKLY",
  },
  {
    name: "Cleaning Service",
    resource: new mongoose.Types.ObjectId(),
    created_by: new mongoose.Types.ObjectId(),
    start_date: new Date("2023-09-05"),
    completion_date: new Date("2023-09-15"),
    interval: 1,
    frequency: "DAILY",
  },
  {
    name: "Monthly Inspection",
    resource: new mongoose.Types.ObjectId(),
    created_by: new mongoose.Types.ObjectId(),
    start_date: new Date("2023-09-01"),
    completion_date: new Date("2023-09-30"),
    interval: 1,
    frequency: "MONTHLY",
  },
];
