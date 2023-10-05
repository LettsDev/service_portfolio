import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { ILocation } from "../../../../data/responseTypes";
const schema = z.object({ name: z.string().min(1, { message: "Required" }) });
import { useNavigate } from "react-router-dom";
import { useLocation } from "../locationTable";
type ValidationSchema = z.infer<typeof schema>;
export default function NewLocationForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    formState,
  } = useForm<ValidationSchema>({ resolver: zodResolver(schema) });
  const { newLocation } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ name: "" });
    }
  }, [formState, reset]);

  const onSubmit: SubmitHandler<ValidationSchema> = async (
    location: Pick<ILocation, "name">
  ) => {
    await newLocation(location).then(() => {
      navigate("/table/locations");
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-xl font-bold mb-2">Create Location</h1>
        <div className="form-control w-full max-w-sm ">
          <input
            type="text"
            placeholder="location name"
            className="input input-bordered w-full max-w-sm"
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
