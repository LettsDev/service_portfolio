import axios, { AxiosResponse } from "axios";
import { IUser, IResponseBase } from "../types";

export async function getAllUsers() {}
export async function updateUser() {}
export async function removeUser() {}
export async function createUser() {}
export async function getUser() {}
export async function getCurrentUser(): Promise<AxiosResponse<IUser>> {
  return axios.get("/api/me");
}
