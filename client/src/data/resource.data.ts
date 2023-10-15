import axios, { AxiosResponse } from "axios";
import { IResource, IResponseBase } from "../types";
import fetchWithCatch from "../utils/fetchWithCatch";

export async function getAllResources(): Promise<IResource[] | null> {
  return fetchWithCatch<IResource[]>({ method: "get", url: "resource" });
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

//querying by location
export async function queryByLocationResources(
  id: string
): Promise<AxiosResponse<IResource[]>> {
  return axios.get(`/api/resource/query_location/${id}`);
}
