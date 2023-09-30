import { useState } from "react";
import { ILocation, IResource } from "../../data/responseTypes";

export default function LocationRow({
  location,
  resources,
}: {
  location: ILocation;
  resources: IResource[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        onClick={() => setOpen(!open)}
        className="cursor-pointer hover:bg-black hover:text-white"
      >
        <td className="font-medium">{location.name}</td>
        <td>{resources.length}</td>
        <td></td>
      </tr>
      {open && (
        <tr>
          <td>
            <div>
              <p>
                created: {new Date(location.createdAt).toLocaleDateString()}
              </p>
              <p>
                last updated:{" "}
                {new Date(location.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </td>
          <td>
            {resources.map((resource) => (
              <p key={resource._id}>{resource.name}</p>
            ))}
          </td>
          <td>
            {/* options */}
            <div className="join join-vertical lg:join-horizontal ">
              <button className="btn join-item bg-accent hover:bg-accent-focus">
                Edit
              </button>
              <button className="btn join-item bg-secondary hover:bg-secondary-focus text-secondary-content">
                Delete
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
