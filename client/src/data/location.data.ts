import axios, { AxiosResponse } from "axios";
import { ILocation, IResponseBase } from "./responseTypes";

export default (function locationApi() {
  async function getAll(): Promise<AxiosResponse<ILocation[]>> {
    return axios.get("/api/location");
  }

  async function update(update: ILocation): Promise<AxiosResponse<ILocation>> {
    return axios.put(`/api/location/:${update._id}`, {
      ...update,
    });
  }
  async function remove(id: string): Promise<AxiosResponse<ILocation>> {
    return axios.delete(`/api/location/:${id}`);
  }
  async function create(
    newLocation: Exclude<ILocation, IResponseBase>
  ): Promise<AxiosResponse<ILocation>> {
    return axios.post("/api/location", newLocation);
  }

  return { getAll, update, remove, create };
})();
