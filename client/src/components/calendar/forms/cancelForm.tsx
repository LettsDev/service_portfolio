import { useLoaderData, useNavigate } from "react-router-dom";
import { ExtendedError, IServiceEventException } from "../../../types";
import { IsoToDate, toIServiceDated } from "../../../utils/dateConversion";
import format from "date-fns/format";
import { formatServiceSchedule } from "../../../utils/calendarUtils";
import Loading from "../../loading";
import Stat from "../../table/stat";
import { useCalendarContext } from "../../../pages/calendar/calendar.page";
import { useAlert } from "../../../context/alert.provider";
export default function CancelForm() {
  const exceptionEvent = useLoaderData() as IServiceEventException;
  const service = exceptionEvent.service;
  const datedService = toIServiceDated(service);
  const { loading, cancelEvent, setLoading } = useCalendarContext();
  const { addAlert } = useAlert();
  const navigate = useNavigate();

  console.log(exceptionEvent);
  const handleCancel = async () => {
    try {
      const cancelledExceptionEvent = {
        ...exceptionEvent,
        is_cancelled: !exceptionEvent.is_cancelled,
      };

      await cancelEvent(cancelledExceptionEvent);
      navigate("/calendar");
      addAlert({
        type: "success",
        message: `Successfully ${
          exceptionEvent.is_cancelled ? "restored" : "cancelled"
        } ${service.name} on ${format(
          IsoToDate(exceptionEvent.exception_date),
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
            : `an error occurred when cancelling the event. Please try again. Error: ${error}`,
      });
    }
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <h1 className="text-lg font-bold mb-2">
            {exceptionEvent.is_cancelled
              ? `Restore ${service.name}`
              : `Cancel ${service.name} `}
          </h1>
          <div className="rounded border mb-2 text-sm sm:text-base p-2 form-control gap-1 ">
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
          </div>

          <button
            type="button"
            disabled={loading}
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            submit
          </button>
        </>
      )}
    </>
  );
}
