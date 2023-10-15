import axios, { AxiosResponse } from "axios";
import { IService, IResponseBase } from "../types";

export async function getAllServices() {}
export async function updateService() {}
export async function removeService() {}
export async function createService() {}
export async function queryByResourceServices(
  resourceId: string
): Promise<AxiosResponse<IService[]>> {
  return axios.get(`/api/service_query/resource/${resourceId}`);
}
