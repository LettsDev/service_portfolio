import { IResource } from "../../../types";
import { useState, Suspense, lazy } from "react";
import Loading from "../../loading";
import TableRowButtons from "../tableRowButtons";
const ResourceRowInner = lazy(() => import("./resourceRowInner"));

type Props = {
  resource: IResource;
};
export default function ResourceRow({ resource }: Props) {
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
              <p className="badge text-xs md:text-sm">{`created: ${new Date(
                resource.createdAt
              ).toLocaleDateString()}`}</p>
              <p className="badge text-xs md:text-sm">{`last updated: ${new Date(
                resource.updatedAt
              ).toLocaleDateString()}`}</p>
              <p className="badge text-xs md:text-sm">{`created by:${resource.created_by.first_name} ${resource.created_by.last_name}`}</p>
            </div>
          </td>
          <td>
            <Suspense fallback={<Loading />}>
              <ResourceRowInner id={resource._id} />
            </Suspense>
          </td>
          <td>
            <TableRowButtons id={resource._id} />
          </td>
        </tr>
      )}
    </>
  );
}
