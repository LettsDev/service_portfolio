import { queryResource } from "../../../data/resource.data";
import { IResource } from "../../../data/responseTypes";
import { useEffect, useState } from "react";
export default function LocationRowInner({ id }: { id: string }) {
  const [resources, setResources] = useState<IResource[]>([]);

  useEffect(() => {
    async function loadResources() {
      const resources = await queryResource(id);
      return resources.data;
    }

    loadResources().then((data) => setResources(data));
  }, []);

  return (
    <ul className="flex flex-col gap-2 justify-center">
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
