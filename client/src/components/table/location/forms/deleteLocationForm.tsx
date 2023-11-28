import { useEffect, useState } from "react";
import { useLocation } from "../locationTable";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import { ILocation } from "../../../../types";
import Loading from "../../../loading";
import { useAlert } from "../../../../context/alert.provider";
export default function DeleteLocationForm() {
  const { addAlert } = useAlert();
  const { id } = useParams();
  const [location, setLocation] = useState<ILocation>();
  const { loading, deleteLocation } = useLocation();
  const loaderData = useLoaderData() as ILocation;
  const navigate = useNavigate();
  useEffect(() => {
    setLocation(loaderData);
  }, []);
  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    console.log(id);
    await deleteLocation(id!);
    navigate("/table/locations");
    addAlert({
      type: "success",
      message: `Successfully deleted: ${loaderData.name}`,
    });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <h1 className="text-xl font-bold mb-2">Delete Location</h1>
          <p>Are you sure you want to delete the following location?</p>
          <p className="badge badge-neutral mt-2">{location?.name}</p>

          <div className="divider"></div>

          <p>
            All of the resources assigned to the location, as well as the
            services attached to the resources will also be deleted.
          </p>
          <form className="mt-4" onSubmit={(ev) => onSubmit(ev)}>
            <button className="btn btn-primary " type="submit">
              Delete
            </button>
          </form>
        </>
      )}
    </>
  );
}
