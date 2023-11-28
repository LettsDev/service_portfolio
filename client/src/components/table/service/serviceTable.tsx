import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Search from "../search";
import useServiceTable from "../../../hooks/useServiceTable";
import Loading from "../../loading";
import ServiceRow from "./serviceRow";
import { IService, IServiceSubmit, IServiceSubmitEdit } from "../../../types";
import NewButton from "../newButton";
import { useAuth } from "../../../context/auth.provider";
export default function ServiceTable() {
  const [query, setQuery] = useState("");
  const { isAuthorized } = useAuth();
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
    <div className="">
      <div className="flex justify-center gap-2">
        <NewButton
          isDisabled={!isAuthorized("ENHANCED")}
          tooltipText="new service"
        />
        <Search setQuery={setQuery} />
      </div>
      <table className="table table-fixed sm:table-md md:table-lg mt-2">
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
