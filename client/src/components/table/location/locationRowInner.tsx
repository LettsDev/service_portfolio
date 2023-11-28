import { queryByLocationResources } from "../../../data/resource.data";
import { IResource } from "../../../types";
import { useEffect, useState } from "react";
export default function LocationRowInner({ id }: { id: string }) {
  const [resources, setResources] = useState<IResource[]>([]);

  useEffect(() => {
    async function loadResources() {
      const response = await queryByLocationResources(id);
      return response.data;
    }

    loadResources().then((data) => setResources(data));
  }, []);

  return (
    <ul className="flex flex-col gap-2 justify-center ">
      {resources.map((resource) => (
        <li key={resource._id} className="cursor-default">
          <div
            className="tooltip tooltip-top tooltip-accent text-accent-content text-xs"
            data-tip={`${resource.notes}`}
          >
            <div className="card card-bordered bg-base-300 rounded-box p-2 text-base-content">
              {resource.name}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
