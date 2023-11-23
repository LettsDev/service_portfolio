import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Search from "../search";
import UseResourceTable from "../../../hooks/useResourceTable";
import { useAuth } from "../../../context/auth.provider";
import Loading from "../../loading";
import ResourceRow from "./resourceRow";
import {
  IResource,
  IResourceSubmit,
  IResourceSubmitEdit,
} from "../../../types";
import NewButton from "../newButton";
export default function ResourceTable() {
  const { isAuthorized } = useAuth();
  const {
    loading,
    setLoading,
    resources,
    deleteResource,
    newResource,
    editResource,
  } = UseResourceTable();
  const [query, setQuery] = useState("");

  const filteredResources = () => {
    return resources.filter(
      (resource) =>
        resource.name.toLowerCase().includes(query.toLowerCase()) ||
        resource.location.name.toLowerCase().includes(query.toLowerCase())
    );
  };
  return (
    <div className="mt-4">
      <div className="flex justify-center gap-2">
        <NewButton
          isDisabled={!isAuthorized("ENHANCED")}
          tooltipText="new resource"
        />
        <Search setQuery={setQuery} />
      </div>
      <table className="table table-fixed table-md mt-2 min-w-[563px]">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Number of Services</th>
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
            {filteredResources().map((resource) => (
              <ResourceRow resource={resource} key={resource._id} />
            ))}
          </tbody>
        )}
      </table>
      <Outlet
        context={{
          loading,
          resources,
          deleteResource,
          newResource,
          editResource,
          setLoading,
        }}
      />
    </div>
  );
}

type ContextType = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  resources: IResource[];
  deleteResource: (id: string) => Promise<void>;
  newResource: (data: IResourceSubmit) => Promise<IResource>;
  editResource: (newResource: IResourceSubmitEdit) => Promise<IResource>;
};

export function useResourceContext() {
  return useOutletContext<ContextType>();
}
