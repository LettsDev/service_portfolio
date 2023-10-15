import { queryByResourceServices } from "../../../data/service.data";
import { useEffect, useState } from "react";
import { IService } from "../../../types";
export default function ResourceRowInner({ id }: { id: string }) {
  const [services, setServices] = useState<IService[]>([]);
  useEffect(() => {
    async function loadServices() {
      const response = await queryByResourceServices(id);
      return response.data;
    }
    loadServices().then((data) => setServices(data));
  }, []);
  return (
    <ul className="flex flex-col gap-2 justify-center">
      {services.map((service) => (
        <li key={service._id}>
          <div
            className="tooltip tooltip-top dark:tooltip-accent"
            data-tip={`starts: ${new Date(
              service.start_date
            ).toLocaleDateString()} \n
            ends: ${new Date(service.completion_date).toLocaleDateString()}`}
          >
            <div className="badge badge-neutral dark:badge-accent">
              {service.name}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
