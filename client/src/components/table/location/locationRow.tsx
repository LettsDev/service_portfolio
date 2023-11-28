import { useState, Suspense, lazy } from "react";
import { ILocation } from "../../../types";
import Loading from "../../loading";
import TableRowButtons from "../tableRowButtons";
import { useAuth } from "../../../context/auth.provider";
import { format } from "date-fns";
import Stat from "../stat";
const LocationRowInner = lazy(() => import("./locationRowInner"));

export default function LocationRow({ location }: { location: ILocation }) {
  const [open, setOpen] = useState(false);
  const { isAuthorized } = useAuth();
  function handleOpen() {
    setOpen(!open);
  }
  return (
    <>
      <tr
        onClick={handleOpen}
        className="cursor-pointer hover:bg-accent hover:text-accent-content"
      >
        <td>{location.name}</td>
        <td>{location.numResources}</td>
        <td></td>
      </tr>
      {open && (
        <tr className="bg-base-200">
          <td>
            <div className="flex flex-col gap-2 ">
              <Stat
                label="created"
                info={format(new Date(location.createdAt), "PP")}
              />
              <Stat
                label="updated"
                info={format(new Date(location.updatedAt), "PP")}
              />
            </div>
          </td>
          <td>
            {
              <Suspense fallback={<Loading />}>
                <LocationRowInner id={location._id} />
              </Suspense>
            }
          </td>
          <td className="text-center">
            <TableRowButtons
              id={location._id}
              editDisabled={!isAuthorized("ADMIN")}
              deleteDisabled={!isAuthorized("ADMIN")}
            />
          </td>
        </tr>
      )}
    </>
  );
}
