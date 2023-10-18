import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { IService, IServiceSubmit, IResponseBase } from "../types";
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
  const editService = async () => {};
  const removeService = async () => {};
  return { loading, services, newService, editService, removeService };
}
