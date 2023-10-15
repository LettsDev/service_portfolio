import { useState, Suspense, lazy } from "react";
import { ILocation } from "../../../types";
import Loading from "../../loading";
import TableRowButtons from "../../tableRowButtons";

const LocationRowInner = lazy(() => import("./locationRowInner"));

export default function LocationRow({ location }: { location: ILocation }) {
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(!open);
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
            <TableRowButtons id={location._id} />
          </td>
        </tr>
      )}
    </>
  );
}
