import axios, { AxiosResponse } from "axios";
import { IResource, IResponseBase } from "./responseTypes";

export default (function resourceApi() {
  async function getAll(): Promise<AxiosResponse<IResource[]>> {
    return axios.get("/api/resource");
  }

  async function update(update: IResource): Promise<AxiosResponse<IResource>> {
    return axios.put(`/api/resource/:${update._id}`, {
      ...update,
    });
  }
  async function remove(id: string): Promise<AxiosResponse<IResource>> {
    return axios.delete(`/api/resource/:${id}`);
  }
  async function create(
    newResource: Exclude<IResource, IResponseBase>
  ): Promise<AxiosResponse<IResource>> {
    return axios.post("/api/resource", newResource);
  }

  return { getAll, update, remove, create };
})();
