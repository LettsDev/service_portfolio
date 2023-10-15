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
        <li key={resource._id}>
          <div
            className="tooltip tooltip-right dark:tooltip-accent"
            data-tip={`Notes: ${resource.notes}`}
          >
            <div className="badge badge-neutral dark:badge-accent">
              {resource.name}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
