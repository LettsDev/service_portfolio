import { useState, useEffect } from "react";
import { useServiceContext } from "../serviceTable";
import { IResource, IServiceSubmit } from "../../../../types";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseAuth } from "../../../../context/auth.provider";
import * as z from "zod";
import { formatISO, isBefore, isSameDay } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

const schema = z
  .object({
    name: z.string(),
    resource: z.string(),
    start_date: z.date(),
    completion_date: z.date(),
    interval: z.number(),
    frequency: z.string(),
  })
  .partial() // makes all the fields optional, which is required for superRefine to run
  .superRefine(
    (
      { name, frequency, interval, resource, start_date, completion_date },
      ctx
    ) => {
      if (name === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "a name is required",
          path: ["name"],
        });
      }
      if (resource === "placeholder") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "a resource is required",
          path: ["resource"],
        });
      }
      if (frequency === "placeholder") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "a frequency is required",
          path: ["frequency"],
        });
      }

      if (interval === 0 && frequency !== "ONCE") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "an interval is required",
          path: ["interval"],
        });
      }
      if (frequency !== "ONCE") {
        if (start_date && completion_date) {
          if (isSameDay(start_date, completion_date)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "the start and end dates cannot be on the same day",
              path: ["start_date"],
            });
          }
          if (typeof interval === "number") {
            if (interval === 0 && frequency !== "ONCE") {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "an interval is required",
                path: ["interval"],
              });
            }

            if (frequency === "WEEKLY" && (interval < 1 || interval > 7)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "an interval of 1 to 7 is required",
                path: ["interval"],
              });
            }
            if (frequency === "MONTHLY" && (interval < 1 || interval > 31)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "an interval of 1 to 31 is required",
                path: ["interval"],
              });
            }
            if (frequency === "ANNUALLY" && (interval < 1 || interval > 365)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "an interval of 1 to 365 is required",
                path: ["interval"],
              });
            }
          }
          if (isBefore(completion_date, start_date)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "the end date cannot be before the start date",
              path: ["end_date"],
            });
          }
        }
      }
    }
  );
type ValidationSchema = z.infer<typeof schema>;

export default function NewServiceForm() {
  const { newService } = useServiceContext();
  const [resources, setResources] = useState<IResource[]>([]);
  const resourcesLoaderData = useLoaderData() as IResource[];
  const { user } = UseAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    formState,
    watch,
  } = useForm<ValidationSchema>({ resolver: zodResolver(schema) });

  const watchFrequency = watch("frequency"); // to apply disabling and styling changes to interval, start_date & end_date when frequency === "ONCE"

  const helperInfo = (watchFrequency: string | undefined) => {
    switch (watchFrequency) {
      case "ONCE":
        return "once: no interval (service only runs once)";
      case "DAILY":
        return "daily: interval is the # of days between events";
      case "WEEKLY":
        return "weekly: interval is the day of the week, use 1 to 7 (Sunday start)";
      case "MONTHLY":
        return "monthly: interval is the day of the month, use 1 to 31 ";
      case "ANNUALLY":
        return "annually: interval is the day of the year, use 1 to 365";
      default:
        return " ";
    }
  };
  useEffect(() => {
    //resetting the form state on successful submission
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  useEffect(() => {
    setResources(resourcesLoaderData);
  }, []);

  const onSubmit: SubmitHandler<ValidationSchema> = async (
    createdService: ValidationSchema
  ) => {
    console.log("createdService: ", createdService);
    console.log("user: ", user);
    const { name, resource, start_date, completion_date, interval, frequency } =
      createdService;
    if (
      user &&
      name &&
      resource &&
      typeof interval === "number" &&
      frequency &&
      start_date &&
      completion_date
    ) {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const formattedService = {
        name,
        resource,
        interval,
        frequency: frequency as IServiceSubmit["frequency"],
        start_date: zonedTimeToUtc(start_date, timeZone).toISOString(),
        completion_date: zonedTimeToUtc(
          completion_date,
          timeZone
        ).toISOString(),
        created_by: user._id,
      };
      console.log("formatted service: ", formattedService);

      await newService(formattedService).then(() =>
        navigate("/table/services")
      );
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-bold mb-2">Create Service</h1>
      {/* ************************* name ************************* */}
      <div className="form-control w-full max-w-sm ">
        <input
          type="text"
          autoFocus
          placeholder="service name"
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
      {/* ************************* resource ************************* */}
      <div className="form-control w-full max-w-sm ">
        <select
          className="select select-bordered"
          {...register("resource")}
          defaultValue="placeholder"
        >
          <option value="placeholder" disabled>
            Please select a resource
          </option>
          {/* sort Alphabetically needed??? */}
          {resources.map((res) => (
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
          defaultValue="placeholder"
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
          defaultValue={0}
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
            defaultValue={formatISO(new Date(), { representation: "date" })}
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
            defaultValue={formatISO(new Date(), { representation: "date" })}
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

// If type = 'Once' then value = 0 (no interval) schedule would execute on start_date
// If type = 'Daily' then value = # of days interval
// If type = 'Weekly' then 1 through 7 for day of the week
// If type = 'Monthly' then 1 through 31 for day of the month
// If type = 'Annually' then 1 through 365 for day of the year
