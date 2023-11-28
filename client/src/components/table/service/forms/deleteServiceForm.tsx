import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { IService } from "../../../../types";
import { useServiceContext } from "../serviceTable";

export default function DeleteServiceForm() {
  const { id } = useParams();
  const loaderData = useLoaderData() as IService;
  const { removeService } = useServiceContext();
  const navigate = useNavigate();

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    await removeService(id!).then(() => navigate("/table/services"));
  };
  return (
    <>
      <h1 className="text-xl font-bold mb-2">Delete Service</h1>
      <h2>Are you sure you want to delete the following service?</h2>
      <p className="badge badge-neutral mt-2">{loaderData.name}</p>

      <form className="mt-4" onSubmit={(ev) => onSubmit(ev)}>
        <button className="btn btn-primary " type="submit">
          Delete
        </button>
      </form>
    </>
  );
}
