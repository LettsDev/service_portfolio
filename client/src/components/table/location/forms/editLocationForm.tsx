import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useLoaderData } from "react-router-dom";
import { useLocation } from "../locationTable";
import { useEffect, useState } from "react";
import { ILocation, ExtendedError } from "../../../../types";
import { useAlert } from "../../../../context/alert.provider";
import Loading from "../../../loading";
const schema = z.object({
  name: z.string().min(1, { message: "name is required" }),
});
type ValidationSchema = z.infer<typeof schema>;

export default function EditLocationForm() {
  const loaderData = useLoaderData() as ILocation;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });
  const { addAlert } = useAlert();
  const [location, setLocation] = useState<ILocation>();
  const navigate = useNavigate();
  const { loading, editLocation, setLoading } = useLocation();
  useEffect(() => {
    setLocation(loaderData);
  }, []);

  const onSubmit: SubmitHandler<ValidationSchema> = async (
    editedLocationName: Pick<ILocation, "name">
  ) => {
    try {
      if (location) {
        const editedLocation = location;
        editedLocation.name = editedLocationName.name;
        await editLocation(editedLocation).then(() => {
          navigate("/table/locations");
          addAlert({
            type: "success",
            message: `Successfully edited: ${editedLocation.name}`,
          });
        });
      }
    } catch (error) {
      setLoading(false);
      navigate("/table/locations");
      addAlert({
        type: "error",
        error:
          error instanceof ExtendedError
            ? `ERROR: ${error.message} \n status code: ${error.statusCode}`
            : `an error occurred when editing the location. Please try again. \n Error: ${error}`,
      });
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-lg pb-4">{`Edit ${location?.name}`}</h1>
          <div className="form-control w-full max-w-sm ">
            <input
              type="text"
              defaultValue={loaderData.name}
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
          <button type="submit" className="btn btn-primary " disabled={loading}>
            Submit
          </button>
        </form>
      )}
    </>
  );
}
