import { useEffect, useState } from "react";
import { useLocation } from "../locationTable";
import { useParams, useNavigate } from "react-router-dom";
import { ILocation } from "../../../../data/responseTypes";
import Loading from "../../../loading";
import ErrorComponent from "../../../error";
export default function DeleteLocationForm() {
  const { id } = useParams();
  const [location, setLocation] = useState<ILocation>();
  const { locations, error, loading, deleteLocation, fetchLocation } =
    useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const load = async () => {
      //refresh on url the context will not load and will have to get data from server
      if (locations.length === 0) {
        setLocation(await fetchLocation(id!));
        return;
      }

      const foundLocation = locations.find((local) => local._id === id);
      if (foundLocation) {
        setLocation(foundLocation);
      }
    };
    load();
  }, []);
  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    console.log(id);
    await deleteLocation(id!).then(() => navigate("/table/locations"));
  };
  if (error) return <ErrorComponent error={error} />;
  if (loading) return <Loading />;
  return (
    <>
      <h1 className="text-xl font-bold mb-2">Delete Location</h1>
      <h2>Are you sure you want to delete the following location?</h2>
      <p className="badge badge-neutral">{location?.name}</p>

      <div className="divider"></div>

      <p>
        All of the equipment assigned to the location, as well as the services
        attached to the equipment will also be deleted.
      </p>
      <form className="mt-2" onSubmit={(ev) => onSubmit(ev)}>
        <button className="btn btn-primary " type="submit">
          Delete
        </button>
      </form>
    </>
  );
}
