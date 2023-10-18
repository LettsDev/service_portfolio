import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import {
  IService,
  IServiceSubmit,
  IResponseBase,
  IServiceSubmitEdit,
} from "../types";
import fetchWithCatch from "../utils/fetchWithCatch";
export default function useServiceTable() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<IService[]>([]);
  const loadedServices = useLoaderData() as IService[];
  useEffect(() => {
    setServices(loadedServices);
    setLoading(false);
  }, []);
  const newService = async (data: IServiceSubmit) => {
    setLoading(true);
    interface INewServiceReturn extends IServiceSubmit, IResponseBase {}
    const newService = await fetchWithCatch<INewServiceReturn>({
      url: "service",
      method: "post",
      data: data,
    });
    const fullNewService = await fetchWithCatch<IService>({
      url: `service/${newService._id}`,
      method: "get",
    });

    setServices([...services, fullNewService]);
    setLoading(false);
  };
  const editService = async (updatedService: IServiceSubmitEdit) => {
    setLoading(true);
    const editedService = await fetchWithCatch<IService>({
      url: `service/${updatedService._id}`,
      method: "put",
      data: updatedService,
    });
    const index = services.findIndex(
      (serve) => serve._id === editedService._id
    );
    const updatedServices = services;
    updatedServices.splice(index, 1, editedService);
    setServices(updatedServices);
    setLoading(false);
  };
  const removeService = async (id: string) => {
    setLoading(true);
    await fetchWithCatch<IService>({
      url: `service/${id}`,
      method: "delete",
    });
    const index = services.findIndex((serve) => serve._id === id);
    const updatedServices = services;
    updatedServices.splice(index, 1);
    setServices(updatedServices);
    setLoading(false);
  };
  return { loading, services, newService, editService, removeService };
}
