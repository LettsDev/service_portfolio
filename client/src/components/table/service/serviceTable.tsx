import { useState } from "react";
import { Outlet, Link, useOutletContext } from "react-router-dom";
import Search from "../search";
import useServiceTable from "../../../hooks/useServiceTable";
import Loading from "../../loading";
import ServiceRow from "./serviceRow";
import { IService, IServiceSubmit, IServiceSubmitEdit } from "../../../types";
export default function ServiceTable() {
  const [query, setQuery] = useState("");
  const { loading, services, newService, editService, removeService } =
    useServiceTable();

  const filteredServices = () =>
    services.filter(
      (service) =>
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.resource.name.toLowerCase().includes(query.toLowerCase()) ||
        service.resource.location.name
          .toLowerCase()
          .includes(query.toLowerCase())
    );

  return (
    <div className="mt-4">
      <div className="flex justify-center gap-2">
        <div
          data-tip="Add Location"
          className="tooltip tooltip-left tooltip-primary"
        >
          <Link
            className="btn text-xl bg-primary hover:bg-primary-focus text-white"
            to="new"
          >
            +
          </Link>
        </div>
        <Search setQuery={setQuery} />
      </div>
      <table className="table table-fixed table-md mt-2 min-w-[563px]">
        <thead className="">
          <tr>
            <th>Name</th>
            <th>
              Resource(<span className="">location</span>)
            </th>
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
            {filteredServices().map((service) => (
              <ServiceRow service={service} key={service._id} />
            ))}
          </tbody>
        )}
      </table>
      <Outlet
        context={{
          loading,
          services,
          removeService,
          newService,
          editService,
        }}
      />
    </div>
  );
}

type ContextType = {
  loading: boolean;
  services: IService[];
  removeService: (id: string) => Promise<void>;
  newService: (data: IServiceSubmit) => Promise<IService>;
  editService: (newService: IServiceSubmitEdit) => Promise<void>;
};

export const useServiceContext = () => {
  return useOutletContext<ContextType>();
};
