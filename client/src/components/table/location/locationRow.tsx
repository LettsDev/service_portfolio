import { useState } from "react";
import { ILocation, IResource } from "../../../types";
import Loading from "../../loading";
import TableRowButtons from "../tableRowButtons";
import { useAuth } from "../../../context/auth.provider";
import { format } from "date-fns";
import Stat from "../stat";
import useFetchWithCatch from "../../../hooks/useFetchWithCatch";
import LocationRowInner from "./locationRowInner";

export default function LocationRow({ location }: { location: ILocation }) {
  const { fetchWithCatch } = useFetchWithCatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<IResource[]>([]);
  const { isAuthorized } = useAuth();
  async function handleOpen() {
    setOpen(!open);
    setLoading(true);
    const loadedResources = await fetchWithCatch<IResource[]>({
      method: "get",
      url: `resource/query_location/${location._id}`,
    });
    setResources(loadedResources);
    setLoading(false);
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
            {loading ? <Loading /> : <LocationRowInner resources={resources} />}
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
