import { object, string, TypeOf, z } from "zod";
import mongoose from "mongoose";

const params = {
  params: object({
    userId: string({ required_error: "userId is required" }),
  }),
};

const payload = {
  body: object({
    first_name: string({
      required_error: "first Name is required",
    }),
    last_name: string({
      required_error: "last name is required",
    }),
    password: string({
      required_error: "password is required",
    }).min(6, "Password too short - should be 6 chars minimum"),
    passwordConfirmation: string({
      required_error: "passwordConfirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    auth: z.enum(["ADMIN", "USER", "ENHANCED"], {
      required_error: "an auth level is required",
    }),
    location: string().transform((val) => {
      const id = new mongoose.Types.ObjectId(val);
      return id;
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
};

const updatePayload = {
  body: object({
    first_name: string({
      required_error: "first Name is required",
    }),
    last_name: string({
      required_error: "last name is required",
    }),
    password: string()
      .min(6, "Password too short - should be 6 chars minimum")
      .optional(),

    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    auth: z.enum(["ADMIN", "USER", "ELEVATED"], {
      required_error: "an auth level is required",
    }),
    location: string().transform((val) => {
      const id = new mongoose.Types.ObjectId(val);
      return id;
    }),
  }),
};
export const createUserSchema = object({ ...payload });

export const updateUserSchema = object({ ...updatePayload, ...params });

export const deleteUserSchema = object({ ...params });

export const getUserSchema = object({ ...params });

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
export type UpdateUserInput = Omit<
  TypeOf<typeof updateUserSchema>,
  "body.passwordConfirmation"
>;
export type DeleteUserInput = TypeOf<typeof deleteUserSchema>;
export type GetUserInput = TypeOf<typeof getUserSchema>;
