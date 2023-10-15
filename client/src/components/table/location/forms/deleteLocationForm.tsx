import { useEffect, useState } from "react";
import { useLocation } from "../locationTable";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import { ILocation } from "../../../../types";
import Loading from "../../../loading";

export default function DeleteLocationForm() {
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
    await deleteLocation(id!).then(() => navigate("/table/locations"));
  };

  if (loading) return <Loading />;
  return (
    <>
      <h1 className="text-xl font-bold mb-2">Delete Location</h1>
      <h2>Are you sure you want to delete the following location?</h2>
      <p className="badge badge-neutral">{location?.name}</p>

      <div className="divider"></div>

      <p>
        All of the resources assigned to the location, as well as the services
        attached to the resources will also be deleted.
      </p>
      <form className="mt-2" onSubmit={(ev) => onSubmit(ev)}>
        <button className="btn btn-primary " type="submit">
          Delete
        </button>
      </form>
    </>
  );
}
