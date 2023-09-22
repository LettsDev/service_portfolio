import type { IUser } from "../types";
import { FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import User from "../models/userModel";
import { omit } from "lodash";

export async function createUser(
  newUser: Omit<
    IUser,
    "createdAt" | "updatedAt" | "validatePassword" | "sanitizePass"
  >
) {
  const user = await User.create(newUser);
  return user;
}

export async function updateUser(
  query: FilterQuery<IUser>,
  update: UpdateQuery<IUser>,
  options: QueryOptions = { new: true }
) {
  try {
    const updatedUser = await User.findByIdAndUpdate(query, update, options);
    if (updatedUser) {
      return updatedUser;
    }
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function deleteUser(
  query: FilterQuery<IUser>,
  options: QueryOptions = {}
) {
  return User.findByIdAndRemove(query, options);
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }

  const isValid = await user.validatePassword(password);
  if (!isValid) return false;

  return omit(user.toJSON(), "password");
}

export async function findUser(
  query: FilterQuery<IUser>,
  options: QueryOptions = {}
) {
  return User.findById(query.id, {}, options);
}

export async function allUsers(options: QueryOptions = {}) {
  return User.find({}, {}, options);
}
