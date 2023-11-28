import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Search from "../search";
import useLocationTable from "../../../hooks/useLocationTable";
import LocationRow from "./locationRow";
import { ILocation } from "../../../types";
import Loading from "../../loading";
import { useAuth } from "../../../context/auth.provider";
import NewButton from "../newButton";
export default function LocationTable() {
  const [query, setQuery] = useState("");
  const {
    loading,
    setLoading,
    locations,
    deleteLocation,
    newLocation,
    editLocation,
  } = useLocationTable();
  const { isAuthorized } = useAuth();
  const filteredLocations = () => {
    //issue with useMemo not updating the table with location change

    return locations.filter((location) =>
      location.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className="">
      <div className="flex justify-center gap-2">
        <NewButton
          isDisabled={!isAuthorized("ADMIN")}
          tooltipText="add location"
        />
        <Search setQuery={setQuery} />
      </div>
      <table className="table table-fixed sm:table-md md:table-lg mt-2">
        <thead className="">
          <tr>
            <th>Name</th>
            <th>Number Of Resources</th>
            {/* Options */}
            <th></th>
          </tr>
        </thead>
        {loading ? (
          <tbody className="">
            <tr className="">
              <td>
                <Loading />
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {filteredLocations().map((location) => (
              <LocationRow location={location} key={location._id} />
            ))}
          </tbody>
        )}
      </table>
      <Outlet
        context={{
          loading,
          locations,
          deleteLocation,
          newLocation,
          editLocation,
          setLoading,
        }}
      />
    </div>
  );
}
type ContextType = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  locations: ILocation[];
  deleteLocation: (id: string) => Promise<void>;
  newLocation: (data: Pick<ILocation, "name">) => Promise<ILocation>;
  editLocation: (newLocation: ILocation) => Promise<ILocation>;
};
export function useLocation() {
  return useOutletContext<ContextType>();
}
