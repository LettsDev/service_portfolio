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
    first_name: "Johnny",
    last_name: "Bravo",
    email: "tester@gmail.com",
    auth: "ENHANCED",
    password: "65f073f6-1897-4f4c-a17b-d910d02fc5da",
  },
  {
    first_name: "Donna",
    last_name: "Beasley",
    email: "tested@gmail.com",
    auth: "USER",
    password: "65f073f6-1897-4f4c-a17b-d910d02fc5da",
  },
  {
    first_name: "sample",
    last_name: "user",
    auth: "USER",
    email: "sample_user@test.com",
    password: "sample123",
  },
  {
    first_name: "enhanced",
    last_name: "user",
    auth: "ENHANCED",
    email: "sample_enhance@test.com",
    password: "sample123",
  },
  {
    first_name: "admin",
    last_name: "user",
    auth: "ADMIN",
    email: "sample_admin@test.com",
    password: "sample123",
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
    completion_date: new Date("2023-11-08"),
    interval: 6,
    frequency: "WEEKLY",
  },
  {
    name: "Cleaning Service",
    resource: new mongoose.Types.ObjectId(),
    created_by: new mongoose.Types.ObjectId(),
    start_date: new Date("2023-09-05"),
    completion_date: new Date("2024-09-15"),
    interval: 20,
    frequency: "DAILY",
  },
  {
    name: "Monthly Inspection",
    resource: new mongoose.Types.ObjectId(),
    created_by: new mongoose.Types.ObjectId(),
    start_date: new Date("2023-09-01"),
    completion_date: new Date("2024-09-30"),
    interval: 20,
    frequency: "MONTHLY",
  },
];
