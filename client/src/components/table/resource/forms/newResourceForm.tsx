import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { ILocation } from "../../../../types";
import { useNavigate, useLoaderData } from "react-router-dom";
import { useResourceContext } from "../resourceTable";
import { UseAuth } from "../../../../context/auth.provider";
const schema = z.object({
  name: z.string().min(1, { message: "A name is required" }),
  location: z.string().min(1, { message: "A location is required" }),
  notes: z.string().optional(),
});
type ValidationSchema = z.infer<typeof schema>;

export default function NewResourceForm() {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const locationLoaderData = useLoaderData() as ILocation[];
  const navigate = useNavigate();
  const { newResource } = useResourceContext();
  const { user } = UseAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    formState,
  } = useForm<ValidationSchema>({ resolver: zodResolver(schema) });

  useEffect(() => {
    //resetting the form state on successful submission
    if (formState.isSubmitSuccessful) {
      reset({ name: "", notes: "" });
    }
  }, [formState, reset]);

  useEffect(() => {
    setLocations(locationLoaderData);
    console.log(user);
  }, []);

  const onSubmit: SubmitHandler<ValidationSchema> = async (
    createdResource: ValidationSchema
  ) => {
    if (user) {
      const submittedResource = { ...createdResource, created_by: user._id };
      console.log("submitted resource: ", submittedResource);
      await newResource({ ...createdResource, created_by: user._id });
    }
    navigate("/table/resources");
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-xl font-bold mb-2">Create Resource</h1>

        <div className="form-control w-full max-w-sm ">
          <input
            type="text"
            autoFocus
            placeholder="resource name"
            className="input input-bordered "
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

        <div className="form-control w-full max-w-sm mb-4">
          <label className="label">
            <span className="label-text">Choose a location</span>
          </label>
          <select
            className="select select-bordered"
            {...register("location")}
            defaultValue="placeholder"
          >
            <option value="placeholder">Please select a location</option>
            {locations.map((local) => (
              <option key={local._id} value={local._id}>
                {local.name}
              </option>
            ))}
          </select>
          <label className="label">
            {errors.location && (
              <span className="label-text-alt text-warning">
                {errors.location.message}
              </span>
            )}
          </label>
        </div>

        <div className="form-control w-full max-w-sm ">
          <textarea
            placeholder="notes"
            className="textarea textarea-bordered "
            {...register("notes")}
          />
          <label className="label">
            {errors.notes && (
              <span className="label-text-alt text-warning">
                {errors.notes.message}
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
