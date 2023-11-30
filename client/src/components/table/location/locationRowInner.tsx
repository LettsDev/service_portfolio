import { IResource } from "../../../types";
export default function LocationRowInner({
  resources,
}: {
  resources: IResource[];
}) {
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
