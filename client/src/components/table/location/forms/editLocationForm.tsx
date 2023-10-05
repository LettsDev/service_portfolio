import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "../locationTable";
import { useEffect, useState } from "react";
import { ILocation } from "../../../../data/responseTypes";
import ErrorComponent from "../../../error";
import Loading from "../../../loading";
const schema = z.object({
  name: z.string().min(1, { message: "name is required" }),
});
type ValidationSchema = z.infer<typeof schema>;

export default function EditLocationForm() {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });
  const [location, setLocation] = useState<ILocation>();
  const navigate = useNavigate();
  const { locations, error, loading, fetchLocation, editLocation } =
    useLocation();
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

  const onSubmit: SubmitHandler<ValidationSchema> = async (
    editedLocationName: Pick<ILocation, "name">
  ) => {
    if (location) {
      const editedLocation = location;
      editedLocation.name = editedLocationName.name;
      await editLocation(editedLocation).then(() => {
        navigate("/table/locations");
      });
    }
  };
  if (error) return <ErrorComponent error={error} />;
  if (loading) return <Loading />;
  return (
    <>
      <h1>{`Edit ${location?.name}`}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full max-w-sm ">
          <input
            type="text"
            placeholder={location ? location.name : "location Name"}
            className={`input input-bordered w-full max-w-sm ${
              errors.name ? "input-error" : ""
            }`}
            {...register("name")}
          />
          <label className="label">
            {errors.name && (
              <span className="label-text-alt text-warning">
                {errors.name.message}
              </span>
            )}
          </label>
        </div>
        <button type="submit" className="btn btn-primary ">
          Submit
        </button>
      </form>
    </>
  );
}
