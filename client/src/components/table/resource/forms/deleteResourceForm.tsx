import { useParams, useLoaderData, useNavigate } from "react-router-dom";
import { useAlert } from "../../../../context/alert.provider";
import Loading from "../../../loading";
import { IResource, ExtendedError } from "../../../../types";
import { useResourceContext } from "../resourceTable";
export default function DeleteResourceForm() {
  const { id } = useParams();
  const loaderData = useLoaderData() as IResource;
  const { deleteResource, setLoading, loading } = useResourceContext();
  const navigate = useNavigate();
  const { addAlert } = useAlert();

  const onSubmit = async (ev: React.FormEvent) => {
    try {
      ev.preventDefault();
      await deleteResource(id!);
      navigate("/table/resources");
      addAlert({
        type: "success",
        message: `Successfully deleted: ${loaderData.name}`,
      });
    } catch (error) {
      setLoading(false);
      navigate("/table/resources");
      addAlert({
        type: "error",
        error:
          error instanceof ExtendedError
            ? `ERROR: ${error.message} \n status code: ${error.statusCode}`
            : `an error occurred when deleting the resource. Please try again. \n Error: ${error}`,
      });
    }
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <form className="mt-2" onSubmit={(ev) => onSubmit(ev)}>
          <h1 className="text-xl font-bold mb-2">Delete Resource</h1>
          <h2>Are you sure you want to delete the following resource?</h2>
          <p className="badge badge-neutral">{loaderData.name}</p>

          <div className="divider"></div>

          <p>
            All of the services assigned to the resource will also be deleted.
          </p>
          <button className="btn btn-primary " type="submit">
            Delete
          </button>
        </form>
      )}
    </>
  );
}
