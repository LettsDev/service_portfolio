import { useState, Suspense, lazy } from "react";
import { ILocation } from "../../../data/responseTypes";
import { Link } from "react-router-dom";
import Loading from "../../loading";

const LocationRowInner = lazy(() => import("./locationRowInner"));

export default function LocationRow({ location }: { location: ILocation }) {
  const [open, setOpen] = useState(false);

  async function handleOpen() {
    setOpen(!open);
    // if open then load resources
  }
  return (
    <>
      <tr
        onClick={handleOpen}
        className="cursor-pointer hover:bg-accent hover:text-white"
      >
        <td className="font-medium">{location.name}</td>
        <td>{location.numResources}</td>
        <td></td>
      </tr>
      {open && (
        <tr>
          <td>
            <div className="flex flex-col gap-2">
              <p className="badge text-xs md:text-sm">
                created: {new Date(location.createdAt).toLocaleDateString()}
              </p>
              <p className="badge text-xs md:text-sm">
                {`last updated: ${new Date(
                  location.updatedAt
                ).toLocaleDateString()}`}
              </p>
            </div>
          </td>
          <td>
            {
              <Suspense fallback={<Loading />}>
                <LocationRowInner id={location._id} />
              </Suspense>
            }
          </td>
          <td>
            {/* buttons to modals */}
            <div className="join join-vertical lg:join-horizontal ">
              <Link
                to={`edit/${location._id}`}
                className="btn join-item bg-primary hover:bg-primary-focus text-white"
              >
                Edit
              </Link>
              <Link
                to={`delete/${location._id}`}
                className="btn join-item bg-secondary hover:bg-secondary-focus text-secondary-content"
              >
                Delete
              </Link>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
