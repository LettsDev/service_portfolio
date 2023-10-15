import axios, { AxiosResponse } from "axios";
import { ISessionResponse } from "../types";
export async function getSession(): Promise<AxiosResponse<ISessionResponse[]>> {
  //should have cookies with the bearer and user information in the request header
  return axios.get("/api/session");
}
export async function createSession({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AxiosResponse<{ accessToken: string; refreshToken: string }>> {
  return axios.post("/api/session", { email, password });
}

export async function deleteSession(): Promise<
  AxiosResponse<{
    accessToken: null;
    refreshToken: null;
  }>
> {
  return axios.delete("/api/session");
}
