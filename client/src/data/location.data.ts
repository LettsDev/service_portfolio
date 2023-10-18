import axios, { AxiosResponse } from "axios";
import { ILocation } from "../types";
import fetchWithCatch from "../utils/fetchWithCatch";
export async function getAllLocations(): Promise<ILocation[] | null> {
  return fetchWithCatch<ILocation[]>({ method: "get", url: "location" });
}

export async function updateLocation(
  update: ILocation
): Promise<AxiosResponse<ILocation>> {
  return axios.put(`/api/location/${update._id}`, {
    ...update,
  });
}
export async function removeLocation(
  id: string
): Promise<AxiosResponse<ILocation>> {
  return axios.delete(`/api/location/${id}`);
}
export async function createLocation(
  newLocation: Pick<ILocation, "name">
): Promise<AxiosResponse<ILocation>> {
  return axios.post("/api/location", newLocation);
}

export async function getLocation(
  id: string
): Promise<AxiosResponse<ILocation>> {
  return axios.get(`/api/location/${id}`);
}