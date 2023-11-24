import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import {
  IService,
  IServiceSubmit,
  IResponseBase,
  IServiceSubmitEdit,
  IServiceDated,
} from "../types";
import useFetchWithCatch from "./useFetchWithCatch";
import { toIServiceDated } from "../utils/dateConversion";

export default function useServiceTable() {
  const { fetchWithCatch } = useFetchWithCatch();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<IServiceDated[]>([]);
  const loadedServices = useLoaderData() as IService[];
  const loadedDatedServices = loadedServices.map((service) =>
    toIServiceDated(service)
  );
  useEffect(() => {
    setServices(loadedDatedServices);
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

    setServices([...services, toIServiceDated(fullNewService)]);
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
    updatedServices.splice(index, 1, toIServiceDated(editedService));
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
