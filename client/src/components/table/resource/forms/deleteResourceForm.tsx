import { useParams, useLoaderData, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IResource } from "../../../../types";
import { useResourceContext } from "../resourceTable";
export default function DeleteResourceForm() {
  const { id } = useParams();
  const [resource, setResource] = useState<IResource>();
  const loaderData = useLoaderData() as IResource;
  const { deleteResource } = useResourceContext();
  const navigate = useNavigate();
  useEffect(() => {
    setResource(loaderData);
  }, []);
  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    await deleteResource(id!).then(() => navigate("/table/resources"));
  };
  return (
    <>
      <h1 className="text-xl font-bold mb-2">Delete Resource</h1>
      <h2>Are you sure you want to delete the following resource?</h2>
      <p className="badge badge-neutral">{resource?.name}</p>

      <div className="divider"></div>

      <p>All of the services assigned to the resource will also be deleted.</p>
      <form className="mt-2" onSubmit={(ev) => onSubmit(ev)}>
        <button className="btn btn-primary " type="submit">
          Delete
        </button>
      </form>
    </>
  );
}
