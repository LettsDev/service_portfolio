import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useLoaderData } from "react-router-dom";
import { useResourceContext } from "../resourceTable";

import { IResource, ILocation } from "../../../../types";

const schema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  location: z.string().min(1, { message: "a location is required" }),
  notes: z.string().optional(),
});

type ValidationSchema = z.infer<typeof schema>;

export default function EditResourceForm() {
  const loaderData = useLoaderData() as {
    resource: IResource;
    locations: ILocation[];
  };
  const navigate = useNavigate();
  const { editResource } = useResourceContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async (
    editedResourceProps: ValidationSchema
  ) => {
    const editedResource = {
      _id: loaderData.resource._id,
      created_by: loaderData.resource.created_by._id,
      location: editedResourceProps.location,
      name: editedResourceProps.name,
      notes: editedResourceProps.notes,
    };

    await editResource(editedResource).then(() => {
      navigate("/table/resources");
    });
  };
  return (
    <>
      <h1>{`Edit ${loaderData.resource.name}`}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full max-w-sm ">
          <input
            type="text"
            placeholder={loaderData.resource.name}
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
        <div className="form-control w-full max-w-sm ">
          <label className="label">
            <span className="label-text">Choose a location</span>
          </label>
          {/* needed to use loaderData and not state because using local state it wouldn't set the default value */}
          <select
            className="select select-bordered"
            defaultValue={loaderData.resource.location._id}
            {...register("location")}
          >
            {loaderData.locations.map((local) => (
              <option value={local._id} key={local._id}>
                {local.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control w-full max-w-sm ">
          <textarea
            placeholder="notes"
            className="textarea textarea-bordered "
            {...register("notes")}
            defaultValue={loaderData.resource.notes}
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
