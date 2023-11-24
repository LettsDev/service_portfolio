import { IResource, IService, IServiceDated } from "../../../types";
import { useState, Suspense, lazy } from "react";
import Loading from "../../loading";
import TableRowButtons from "../tableRowButtons";
import useFetchWithCatch from "../../../hooks/useFetchWithCatch";
import { toIServiceDated } from "../../../utils/dateConversion";
import { useAuth } from "../../../context/auth.provider";

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
        className="cursor-pointer hover:bg-accent hover:text-white"
      >
        <td>{resource.name}</td>
        <td>{resource.location.name}</td>
        <td>{resource.numServices}</td>
        <td></td>
      </tr>
      {open && (
        <tr>
          {resource.notes ? <td>{`Note: ${resource.notes}`}</td> : <td />}
          <td>
            <div className="flex flex-col gap-2">
              <p className="badge text-xs md:text-sm cursor-default">{`created: ${new Date(
                resource.createdAt
              ).toLocaleDateString()}`}</p>
              <p className="badge text-xs md:text-sm cursor-default">{`last updated: ${new Date(
                resource.updatedAt
              ).toLocaleDateString()}`}</p>
              <p className="badge text-xs md:text-sm cursor-default">{`created by: ${resource.created_by.first_name} ${resource.created_by.last_name}`}</p>
            </div>
          </td>
          <td>
            <Suspense fallback={<Loading />}>
              <ResourceRowInner datedServices={services} />
            </Suspense>
          </td>
          <td>
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
