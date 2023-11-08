import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLoaderData, useNavigate } from "react-router-dom";
import { UseAuth } from "../../../context/auth.provider";
import { IServiceEventException } from "../../../types";
import { format, isSameDay } from "date-fns";
import { formatServiceSchedule } from "../../../utils/calendarUtils";
const schema = z.object({
  rescheduleExceptionDate: z.string().min(1, { message: "date is required" }),
});
type ValidationSchema = z.infer<typeof schema>;
export default function RescheduleForm() {
  const exceptionEvent = useLoaderData() as IServiceEventException;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    formState,
  } = useForm<ValidationSchema>({ resolver: zodResolver(schema) });

  const navigate = useNavigate();
  const { user } = UseAuth();
  const service = exceptionEvent.service;
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);
  const onSubmit: SubmitHandler<ValidationSchema> = async ({
    rescheduleExceptionDate,
  }) => {
    console.log(new Date(rescheduleExceptionDate).toISOString());
    console.log(new Date(exceptionEvent.exception_date).toISOString());
    if (
      !isSameDay(
        new Date(rescheduleExceptionDate),
        new Date(exceptionEvent.exception_date)
      )
    ) {
      //compare to make sure that it is the same year, month, day
      console.log("not the same day");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-control p-2">
      <h1 className="text-xl font-bold mb-2">Reschedule Event</h1>
      <div className="rounded border p-4 mb-2">
        <p>{service.name}</p>
        <p>{`resource(location): ${service.resource.name}(${service.resource.location.name})`}</p>

        <p>{`created: ${new Date(
          exceptionEvent.createdAt
        ).toLocaleDateString()}`}</p>
        <p>
          {`created by: ${service.created_by.first_name} ${service.created_by.last_name}`}
        </p>

        <p>{`scheduled: ${formatServiceSchedule({
          interval: service.interval,
          frequency: service.frequency,
          start_date: service.start_date,
          completion_date: service.completion_date,
        })}`}</p>
        <p className="">{`scheduled date: ${format(
          new Date(exceptionEvent.exception_date),
          "yyy-MM-dd"
        )}`}</p>
      </div>
      {exceptionEvent.is_rescheduled ? (
        <p className="pl-1">{`already rescheduled to: ${format(
          new Date(exceptionEvent.exception_date),
          "yyy-MM-dd"
        )}`}</p>
      ) : undefined}
      <label htmlFor="date" className="label">
        reschedule event to:
      </label>
      <input
        id="date"
        type="date"
        className="input input-bordered"
        {...register("rescheduleExceptionDate")}
        defaultValue={`${format(
          new Date(exceptionEvent.exception_date),
          "yyy-MM-dd"
        )}`}
      />
      <label className="label">
        {errors.rescheduleExceptionDate && (
          <span className="label-text-alt text-warning">
            {errors.rescheduleExceptionDate.message}
          </span>
        )}
      </label>
      <div className=" mt-2">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
}
