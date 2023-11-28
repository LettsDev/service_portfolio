import { IResource, IService, IServiceDated } from "../../../types";
import { useState, Suspense, lazy } from "react";
import Loading from "../../loading";
import TableRowButtons from "../tableRowButtons";
import useFetchWithCatch from "../../../hooks/useFetchWithCatch";
import { toIServiceDated } from "../../../utils/dateConversion";
import { useAuth } from "../../../context/auth.provider";
import Stat from "../stat";
import { format } from "date-fns";
const ResourceRowInner = lazy(() => import("./resourceRowInner"));

type Props = {
  resource: IResource;
};
export default function ResourceRow({ resource }: Props) {
  const { fetchWithCatch } = useFetchWithCatch();
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<IServiceDated[]>([]);
  const { isAuthorized, user } = useAuth();
  async function handleOpen() {
    setOpen(!open);
    const loadedServices = await fetchWithCatch<IService[]>({
      url: `service_query/resource/${resource._id}`,
      method: "get",
    });
    const datedServices = loadedServices.map((service) =>
      toIServiceDated(service)
    );
    setServices(datedServices);
  }
  return (
    <>
      <tr
        onClick={handleOpen}
        className="cursor-pointer hover:bg-accent hover:text-accent-content"
      >
        <td>{resource.name}</td>
        <td>{resource.location.name}</td>
        <td>{resource.numServices}</td>
        <td></td>
      </tr>
      {open && (
        <tr className="bg-base-200">
          <td className="px-[0.3rem] sm:px-4">
            {resource.notes ? (
              <Stat label="Notes" info={resource.notes} />
            ) : null}
          </td>
          <td className="px-[0.3rem] sm:px-4">
            <div className="flex flex-col gap-2">
              <Stat
                label="created"
                info={format(new Date(resource.createdAt), "PP")}
              />
              <Stat
                label="updated"
                info={format(new Date(resource.updatedAt), "PP")}
              />
              <Stat
                label="created by"
                info={`${resource.created_by.first_name} ${resource.created_by.last_name}`}
              />
            </div>
          </td>
          <td className="px-[0.3rem] sm:px-4">
            <Suspense fallback={<Loading />}>
              <ResourceRowInner datedServices={services} />
            </Suspense>
          </td>
          <td className="px-[0.3rem] sm:px-4 text-center">
            <TableRowButtons
              id={resource._id}
              editDisabled={
                !(
                  (user!._id === resource.created_by._id &&
                    isAuthorized("ENHANCED")) ||
                  isAuthorized("ADMIN")
                )
              }
              deleteDisabled={
                !(
                  (isAuthorized("ENHANCED") &&
                    user!._id === resource.created_by._id) ||
                  isAuthorized("ADMIN")
                )
              }
            />
          </td>
        </tr>
      )}
    </>
  );
}
