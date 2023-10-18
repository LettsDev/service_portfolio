import { useEffect } from "react";
import { useServiceContext } from "../serviceTable";
import { IResource, IService, IServiceSubmitEdit } from "../../../../types";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseAuth } from "../../../../context/auth.provider";
import { formatISO } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import type { ValidationSchema } from "../../../../schemas/serviceSchemas";
import { serviceSchema, helperInfo } from "../../../../schemas/serviceSchemas";
export default function EditServiceForm() {
  const loaderData = useLoaderData() as {
    resources: IResource[];
    service: IService;
  };
  const { editService } = useServiceContext();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    formState,
    watch,
  } = useForm<ValidationSchema>({ resolver: zodResolver(serviceSchema) });

  const watchFrequency = watch("frequency"); // to apply disabling and styling changes to interval, start_date & end_date when frequency === "ONCE"

  useEffect(() => {
    //resetting the form state on successful submission
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  const onSubmit: SubmitHandler<ValidationSchema> = async (
    updatedServiceInputs: ValidationSchema
  ) => {
    const { name, resource, start_date, completion_date, interval, frequency } =
      updatedServiceInputs;
    if (
      name &&
      resource &&
      typeof interval === "number" &&
      frequency &&
      start_date &&
      completion_date
    ) {
      const editedService: IServiceSubmitEdit = {
        name,
        resource,
        interval,
        frequency: frequency as IServiceSubmitEdit["frequency"],
        _id: loaderData.service._id,
        created_by: loaderData.service.created_by._id,
        start_date: zonedTimeToUtc(start_date, timeZone).toISOString(),
        completion_date: zonedTimeToUtc(
          completion_date,
          timeZone
        ).toISOString(),
      };
      await editService(editedService);
      navigate("/table/services");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-bold mb-2">Edit Service</h1>
      {/* ************************* name ************************* */}
      <div className="form-control w-full max-w-sm ">
        <input
          type="text"
          autoFocus
          placeholder="service name"
          className="input input-bordered "
          defaultValue={loaderData.service.name}
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
      {/* ************************* resource ************************* */}
      <div className="form-control w-full max-w-sm ">
        <select
          className="select select-bordered"
          {...register("resource")}
          defaultValue={loaderData.service.resource._id}
        >
          <option value="placeholder" disabled>
            Please select a resource
          </option>
          {/* sort Alphabetically needed??? */}
          {loaderData.resources.map((res) => (
            <option key={res._id} value={res._id}>
              {res.name}({res.location.name})
            </option>
          ))}
        </select>
        <label className="label">
          {errors.resource && (
            <span className="label-text-alt text-warning">
              {errors.resource.message}
            </span>
          )}
        </label>
      </div>
      {/* ************************* frequency ************************* */}
      <div className="form-control w-full max-w-sm mb-4">
        <select
          className="select select-bordered"
          {...register("frequency")}
          defaultValue={loaderData.service.frequency}
        >
          <option value="placeholder" disabled>
            Please select a frequency
          </option>
          {["ONCE", "DAILY", "WEEKLY", "MONTHLY", "ANNUALLY"].map((freq) => (
            <option key={freq} value={freq}>
              {freq.toLowerCase()}
            </option>
          ))}
        </select>
        <label className="label">
          {errors.frequency && (
            <span className="label-text-alt text-warning">
              {errors.frequency.message}
            </span>
          )}
        </label>
        {/* helper label */}
        <p>{helperInfo(watchFrequency)}</p>
      </div>
      {/* ************************* interval ************************* */}

      <div className="form-control w-full max-w-sm ">
        <div className="flex items-baseline">
          <label htmlFor="interval" className="label">
            <span className="label-text">Interval</span>
          </label>
        </div>
        <input
          type="number"
          id="interval"
          {...register("interval", { valueAsNumber: true })}
          className="input input-bordered"
          defaultValue={loaderData.service.interval}
          disabled={watchFrequency === "ONCE"}
        />
        <label className="label">
          {errors.interval && (
            <span className="label-text-alt text-warning">
              {errors.interval.message}
            </span>
          )}
        </label>
      </div>

      <div className="flex">
        {/* ************************* start_date ************************* */}
        <div className="form-control w-full max-w-sm mb-4">
          <label className="label" htmlFor="start_date">
            <span className="label-text">
              {watchFrequency === "ONCE"
                ? "Choose a date"
                : "Choose a start date"}
            </span>
          </label>
          <input
            type="date"
            id="start_date"
            // need to set defaultValue for the schema to pass the initial verification stage and have superRefine run
            defaultValue={formatISO(
              new Date(utcToZonedTime(loaderData.service.start_date, timeZone)),
              { representation: "date" }
            )}
            className="input input-bordered "
            {...register("start_date", { valueAsDate: true })}
          />

          <label className="label">
            {errors.start_date && (
              <span className="label-text-alt text-warning">
                {errors.start_date.message}
              </span>
            )}
          </label>
        </div>
        {/* ************************* end_date ************************* */}
        <div className="form-control w-full max-w-sm mb-4">
          <label className="label" htmlFor="end_date">
            <span className="label-text">Choose an end date</span>
          </label>
          <input
            type="date"
            id="completion_date"
            className="input input-bordered "
            // need to set defaultValue for the schema to pass the initial verification stage and have superRefine schema run
            defaultValue={formatISO(
              new Date(
                utcToZonedTime(loaderData.service.completion_date, timeZone)
              ),
              { representation: "date" }
            )}
            disabled={watchFrequency === "ONCE"}
            {...register("completion_date", { valueAsDate: true })}
          />
          <label className="label">
            {errors.completion_date && (
              <span className="label-text-alt text-warning">
                {errors.completion_date.message}
              </span>
            )}
          </label>
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-primary "
        onClick={() => console.log(formState)}
      >
        Submit
      </button>
    </form>
  );
}
