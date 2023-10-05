import axios, { AxiosResponse } from "axios";
import { IResource, IResponseBase } from "./responseTypes";

export async function getAllResources(): Promise<AxiosResponse<IResource[]>> {
  return axios.get("/api/resource");
}

export async function updateResource(
  update: IResource
): Promise<AxiosResponse<IResource>> {
  return axios.put(`/api/resource/${update._id}`, {
    ...update,
  });
}
export async function removeResource(
  id: string
): Promise<AxiosResponse<IResource>> {
  return axios.delete(`/api/resource/${id}`);
}
export async function createResource(
  newResource: Exclude<IResource, IResponseBase>
): Promise<AxiosResponse<IResource>> {
  return axios.post("/api/resource", newResource);
}

export async function queryResource(
  id: string
): Promise<AxiosResponse<IResource[]>> {
  return axios.get(`/api/resource/query/${id}`);
}
