import { useState, useEffect, useMemo } from "react";
import Search from "./search";
import useLocationTable from "../../hooks/useLocationTable";
import LocationRow from "./locationRow";
export default function LocationTable() {
  const [query, setQuery] = useState("");
  const { error, loading, locations, resources } = useLocationTable();

  const filteredLocations = useMemo(() => {
    return locations.filter((location) =>
      location.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, locations]);

  if (error)
    return (
      <div className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Network Error: {error.message}</span>
      </div>
    );

  return (
    <div className="mt-4">
      <div className="flex justify-center gap-2">
        <div data-tip="Add Location" className="tooltip tooltip-left">
          <button className="btn text-xl bg-accent hover:bg-accent-focus ">
            +
          </button>
        </div>
        <Search setQuery={setQuery} />
      </div>
      <table className="table table-fixed table-md mt-2">
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
                <span className="loading loading-dots loading-lg"></span>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {filteredLocations.map((location) => (
              <LocationRow
                location={location}
                key={location._id}
                resources={resources.filter(
                  (resource) => resource.location._id === location._id
                )}
              />
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
