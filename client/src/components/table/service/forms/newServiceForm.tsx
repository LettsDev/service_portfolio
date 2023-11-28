import { useEffect } from "react";
import { useServiceContext } from "../serviceTable";
import { IResource, IServiceSubmit } from "../../../../types";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../../context/auth.provider";
import { formatISO, format } from "date-fns";
import type { ValidationSchema } from "../../../../schemas/serviceSchemas";
import { serviceSchema, helperInfo } from "../../../../schemas/serviceSchemas";
import { frequencyIntervalSwitcher } from "../../../../utils/formUtils";
export default function NewServiceForm() {
  const { newService } = useServiceContext();

  const resourcesLoaderData = useLoaderData() as IResource[];
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    formState,
    watch,
  } = useForm<ValidationSchema>({ resolver: zodResolver(serviceSchema) });

  const watchFrequency = watch("frequency"); // to apply disabling and styling changes

  useEffect(() => {
    //resetting the form state on successful submission
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  const onSubmit: SubmitHandler<ValidationSchema> = async (
    createdService: ValidationSchema
  ) => {
    const {
      name,
      resource,
      startDate,
      weeklyStartDate,
      monthlyStartDate,
      annualStartDate,
      completionDate,
      weeklyCompletionDate,
      monthlyCompletionDate,
      annualCompletionDate,
      frequency,
      dailyInterval,
      weeklyInterval,
      monthlyInterval,
      annualInterval,
    } = createdService;
    if (
      name &&
      resource &&
      startDate &&
      weeklyStartDate &&
      monthlyStartDate &&
      annualStartDate &&
      completionDate &&
      weeklyCompletionDate &&
      monthlyCompletionDate &&
      annualCompletionDate &&
      frequency &&
      dailyInterval &&
      weeklyInterval &&
      monthlyInterval &&
      annualInterval &&
      user
    ) {
      const { interval, formattedStartDate, formattedCompletionDate } =
        frequencyIntervalSwitcher({
          frequency: frequency as IServiceSubmit["frequency"],
          intervals: {
            dailyInterval,
            weeklyInterval,
            monthlyInterval,
            annualInterval,
          },
          startDates: {
            startDate,
            weeklyStartDate,
            monthlyStartDate,
            annualStartDate,
          },
          completionDates: {
            completionDate,
            weeklyCompletionDate,
            monthlyCompletionDate,
            annualCompletionDate,
          },
        });
      const formattedService = {
        name,
        resource,
        interval: interval,
        frequency: frequency as IServiceSubmit["frequency"],
        start_date: formattedStartDate,
        completion_date: formattedCompletionDate,
        created_by: user._id,
      };
      console.log(formattedService);
      await newService(formattedService);
      navigate("/table/services");
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
          {resourcesLoaderData
            .sort((a, b) =>
              a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
            )
            .map((res) => (
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

      <div
        className={`form-control w-full max-w-sm ${
          watchFrequency === "placeholder" ||
          watchFrequency === "ONCE" ||
          watchFrequency === undefined
            ? "hidden"
            : ""
        }`}
      >
        <div className="flex items-baseline">
          <label htmlFor="interval" className="label">
            <span className="label-text">Interval</span>
          </label>
        </div>
        {/* ************************* DailyInterval ************************* */}
        <div className={`${watchFrequency === "DAILY" ? "" : "hidden"}`}>
          <input
            type="number"
            id="interval"
            {...register("dailyInterval")}
            className={`input input-bordered `}
            defaultValue="0"
          />
          <label className="label">
            {errors.dailyInterval && (
              <span className="label-text-alt text-warning">
                {errors.dailyInterval.message}
              </span>
            )}
          </label>
        </div>
        {/* ************************* WeeklyInterval ************************* */}
        <div className={`${watchFrequency === "WEEKLY" ? "" : "hidden"}`}>
          <select
            className={`input input-bordered `}
            defaultValue={7}
            {...register("weeklyInterval")}
          >
            <option value={7} disabled>
              Please choose a day
            </option>
            <option value={0}>Sunday</option>
            <option value={1}>Monday</option>
            <option value={2}>Tuesday</option>
            <option value={3}>Wednesday</option>
            <option value={4}>Thursday</option>
            <option value={5}>Friday</option>
            <option value={6}>Saturday</option>
          </select>
          <label className="label">
            {errors.weeklyInterval && (
              <span className="label-text-alt text-warning">
                {errors.weeklyInterval.message}
              </span>
            )}
          </label>
        </div>
        {/* ************************* MonthlyInterval ************************* */}
        <div className={`${watchFrequency === "MONTHLY" ? "" : "hidden"}`}>
          <input
            type="number"
            id="interval"
            {...register("monthlyInterval")}
            className={`input input-bordered `}
            defaultValue={1}
          />
          <label className="label">
            {errors.monthlyInterval && (
              <span className="label-text-alt text-warning">
                {errors.monthlyInterval.message}
              </span>
            )}
          </label>
        </div>
        {/* ************************* annualInterval ************************* */}

        <div className={`${watchFrequency === "ANNUALLY" ? "" : "hidden"}`}>
          <input
            type="date"
            id="interval"
            {...register("annualInterval")}
            defaultValue={formatISO(new Date(), { representation: "date" })}
            className={`input input-bordered `}
          />
          <label className="label">
            {errors.annualInterval && (
              <span className="label-text-alt text-warning">
                {errors.annualInterval.message}
              </span>
            )}
          </label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* ************************* startDate  ************************* */}
        {/* ************************* startDate ONCE || DAILY ************************* */}
        <div
          className={` ${
            watchFrequency === "ONCE" || watchFrequency === "DAILY"
              ? "form-control w-full max-w-sm mb-4"
              : "hidden"
          }`}
        >
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
            defaultValue={`${format(new Date(), "yyy-MM-dd")}`}
            className="input input-bordered "
            {...register("startDate")}
          />

          <label className="label">
            {errors.startDate && (
              <span className="label-text-alt text-warning">
                {errors.startDate.message}
              </span>
            )}
          </label>
        </div>
        {/* ************************* startDate  WEEKLY************************* */}
        <div
          className={` ${
            watchFrequency === "WEEKLY"
              ? "form-control w-full max-w-sm mb-4"
              : "hidden"
          }`}
        >
          <label className="label" htmlFor="start_week">
            <span className="label-text">
              Choose a starting week (Sun - Sat)
            </span>
          </label>
          <input
            type="date"
            id="start_week"
            // need to set defaultValue for the schema to pass the initial verification stage and have superRefine run
            defaultValue={`${format(new Date(), "yyy-MM-dd")}`}
            className="input input-bordered "
            {...register("weeklyStartDate")}
          />

          <label className="label">
            {errors.weeklyStartDate && (
              <span className="label-text-alt text-warning">
                {errors.weeklyStartDate.message}
              </span>
            )}
          </label>
        </div>
        {/* ************************* startDate Month ************************* */}
        <div
          className={` ${
            watchFrequency === "MONTHLY"
              ? "form-control w-full max-w-sm mb-4"
              : "hidden"
          }`}
        >
          <label className="label" htmlFor="start_month">
            <span className="label-text">Choose a starting month</span>
          </label>
          <input
            type="date"
            id="start_month"
            // need to set defaultValue for the schema to pass the initial verification stage and have superRefine run
            defaultValue={`${format(new Date(), "yyy-MM-dd")}`}
            className="input input-bordered "
            {...register("monthlyStartDate")}
          />

          <label className="label">
            {errors.monthlyStartDate && (
              <span className="label-text-alt text-warning">
                {errors.monthlyStartDate.message}
              </span>
            )}
          </label>
        </div>
        {/* ************************* startDate Year************************* */}
        <div
          className={` ${
            watchFrequency === "ANNUALLY"
              ? "form-control w-full max-w-sm mb-4"
              : "hidden"
          }`}
        >
          <label className="label" htmlFor="start_year">
            <span className="label-text">Choose a starting year</span>
          </label>
          <input
            type="number"
            id="start_year"
            // need to set defaultValue for the schema to pass the initial verification stage and have superRefine run
            defaultValue={new Date().getFullYear()}
            className="input input-bordered "
            {...register("annualStartDate")}
          />

          <label className="label">
            {errors.annualStartDate && (
              <span className="label-text-alt text-warning">
                {errors.annualStartDate.message}
              </span>
            )}
          </label>
        </div>
        {/* ************************* end_date ************************* */}
        {/* ************************* end_date DAILY ************************* */}
        <div
          className={` ${
            watchFrequency === "DAILY"
              ? "form-control w-full max-w-sm mb-4"
              : "hidden"
          }`}
        >
          <label className="label" htmlFor="completionDate">
            <span className="label-text">Choose an end date</span>
          </label>
          <input
            type="date"
            id="completionDate"
            className="input input-bordered "
            // need to set defaultValue for the schema to pass the initial verification stage and have superRefine schema run
            defaultValue={`${format(new Date(), "yyy-MM-dd")}`}
            {...register("completionDate")}
          />
          <label className="label">
            {errors.completionDate && (
              <span className="label-text-alt text-warning">
                {errors.completionDate.message}
              </span>
            )}
          </label>
        </div>
        {/* ************************* end_date WEEKLY ************************* */}
        <div
          className={` ${
            watchFrequency === "WEEKLY"
              ? "form-control w-full max-w-sm mb-4"
              : "hidden"
          }`}
        >
          <label className="label" htmlFor="weeklyCompletionDate">
            <span className="label-text">
              Choose an ending week (Sun - Sat)
            </span>
          </label>
          <input
            type="date"
            id="weeklyCompletionDate"
            className="input input-bordered "
            // need to set defaultValue for the schema to pass the initial verification stage and have superRefine schema run
            defaultValue={`${format(new Date(), "yyy-MM-dd")}`}
            {...register("weeklyCompletionDate")}
          />
          <label className="label">
            {errors.weeklyCompletionDate && (
              <span className="label-text-alt text-warning">
                {errors.weeklyCompletionDate.message}
              </span>
            )}
          </label>
        </div>
        {/* ************************* end_date MONTHLY ************************* */}
        <div
          className={` ${
            watchFrequency === "MONTHLY"
              ? "form-control w-full max-w-sm mb-4"
              : "hidden"
          }`}
        >
          <label className="label" htmlFor="monthlyCompletionDate">
            <span className="label-text">Choose an ending month</span>
          </label>
          <input
            type="date"
            id="monthlyCompletionDate"
            className="input input-bordered "
            // need to set defaultValue for the schema to pass the initial verification stage and have superRefine schema run
            defaultValue={`${format(new Date(), "yyy-MM-dd")}`}
            {...register("monthlyCompletionDate")}
          />
          <label className="label">
            {errors.monthlyCompletionDate && (
              <span className="label-text-alt text-warning">
                {errors.monthlyCompletionDate.message}
              </span>
            )}
          </label>
        </div>
        {/* ************************* end_date Year ************************* */}
        <div
          className={` ${
            watchFrequency === "ANNUALLY"
              ? "form-control w-full max-w-sm mb-4"
              : "hidden"
          }`}
        >
          <label className="label" htmlFor="annualCompletionDate">
            <span className="label-text">Choose an ending year</span>
          </label>
          <input
            type="number"
            id="annualCompletionDate"
            className="input input-bordered "
            // need to set defaultValue for the schema to pass the initial verification stage and have superRefine schema run
            defaultValue={new Date().getFullYear() + 1}
            min={new Date().getFullYear()}
            {...register("annualCompletionDate")}
          />
          <label className="label">
            {errors.annualCompletionDate && (
              <span className="label-text-alt text-warning">
                {errors.annualCompletionDate.message}
              </span>
            )}
          </label>
        </div>
      </div>

      <button type="submit" className="btn btn-primary ">
        Submit
      </button>
    </form>
  );
}
