import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth.provider";
import { IServiceEventException, ExtendedError } from "../../../types";
import { format, isSameDay } from "date-fns";
import { formatServiceSchedule } from "../../../utils/calendarUtils";
import { useAlert } from "../../../context/alert.provider";
import Loading from "../../loading";
import Stat from "../../table/stat";
import {
  toIServiceDated,
  IsoToDate,
  fromDatePickerToDate,
  dateToIso,
} from "../../../utils/dateConversion";
import { useCalendarContext } from "../../../pages/calendar/calendar.page";
const schema = z.object({
  rescheduleExceptionDate: z.string().min(1, { message: "date is required" }),
});
type ValidationSchema = z.infer<typeof schema>;
export default function RescheduleForm() {
  const exceptionEvent = useLoaderData() as IServiceEventException;
  const { addAlert } = useAlert();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    formState,
  } = useForm<ValidationSchema>({ resolver: zodResolver(schema) });

  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, rescheduleEvent, setLoading } = useCalendarContext();
  const service = exceptionEvent.service;
  const datedService = toIServiceDated(service);
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);
  const onSubmit: SubmitHandler<ValidationSchema> = async ({
    rescheduleExceptionDate,
  }) => {
    try {
      if (
        isSameDay(
          fromDatePickerToDate(rescheduleExceptionDate),
          IsoToDate(exceptionEvent.exception_date)
        )
      ) {
        //trying to change to same day
        return navigate("/calendar");
      }
      const originalEventDate = IsoToDate(exceptionEvent.exception_date);
      // create new event
      const editedExceptionEvent: IServiceEventException = {
        ...exceptionEvent,
        exception_date: dateToIso(
          fromDatePickerToDate(rescheduleExceptionDate)
        ),
        is_rescheduled: true,
        created_by: user!,
      };
      await rescheduleEvent(editedExceptionEvent, originalEventDate);
      navigate("/calendar");
      addAlert({
        type: "success",
        message: `Successfully rescheduled ${service.name} to ${format(
          IsoToDate(editedExceptionEvent.exception_date),
          "PPPP"
        )}`,
      });
    } catch (error) {
      setLoading(false);
      navigate("/calendar");
      addAlert({
        type: "error",
        error:
          error instanceof ExtendedError
            ? `ERROR: ${error.message} \n status code: ${error.statusCode}`
            : `an error occurred when rescheduling the event. Please try again. Error: ${error}`,
      });
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="form-control p-2">
          <h1 className="text-lg font-bold mb-2">{`Reschedule ${service.name}`}</h1>
          <div className="rounded border p-4 mb-2 form-control gap-2">
            <Stat
              label="resource(location)"
              info={`${service.resource.name}(${service.resource.location.name})`}
            />

            <Stat
              label="created"
              info={`${format(
                IsoToDate(exceptionEvent.createdAt),
                "yyyy-MM-dd"
              )}`}
            />

            <Stat
              label="created by"
              info={`${exceptionEvent.created_by.first_name} ${exceptionEvent.created_by.last_name}`}
            />

            <Stat
              label="schedule"
              info={`${formatServiceSchedule({
                interval: service.interval,
                frequency: service.frequency,
                start_date: datedService.start_date,
                completion_date: datedService.completion_date,
              })}`}
            />

            <Stat
              label="event date"
              info={`${format(
                IsoToDate(exceptionEvent.exception_date),
                "PPPP"
              )}`}
            />

            {exceptionEvent.is_rescheduled ? (
              <Stat
                label="already rescheduled from"
                info={`${format(
                  IsoToDate(exceptionEvent.start_date),
                  "yyyy-MM-dd"
                )}`}
              />
            ) : // <p className="pl-1">{`already rescheduled from: ${format(
            //   IsoToDate(exceptionEvent.start_date),
            //   "yyyy-MM-dd"
            // )}`}</p>
            undefined}
          </div>
          <label htmlFor="date" className="label">
            reschedule event
          </label>
          <input
            id="date"
            type="date"
            className="input input-bordered"
            {...register("rescheduleExceptionDate")}
            defaultValue={`${format(
              IsoToDate(exceptionEvent.exception_date),
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
      )}
    </>
  );
}
