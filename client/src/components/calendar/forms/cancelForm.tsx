import { useLoaderData, useNavigate } from "react-router-dom";
import { IServiceEventException } from "../../../types";
import { IsoToDate, toIServiceDated } from "../../../utils/dateConversion";
import format from "date-fns/format";
import { formatServiceSchedule } from "../../../utils/calendarUtils";
import Loading from "../../loading";
import { useCalendarContext } from "../../../pages/calendar/calendar.page";
export default function CancelForm() {
  const exceptionEvent = useLoaderData() as IServiceEventException;
  const service = exceptionEvent.service;
  const datedService = toIServiceDated(service);
  const { loading, cancelEvent } = useCalendarContext();
  const navigate = useNavigate();
  console.log(exceptionEvent);
  const handleCancel = async () => {
    const cancelledExceptionEvent = {
      ...exceptionEvent,
      is_cancelled: !exceptionEvent.is_cancelled,
    };
    await cancelEvent(cancelledExceptionEvent);
    console.log(exceptionEvent._id);
    navigate("/calendar");
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <h1 className="text-xl font-bold mb-2">
            {exceptionEvent.is_cancelled ? "Restore Event" : "Cancel Event"}
          </h1>
          <div className="rounded border p-4 mb-2">
            <p>{service.name}</p>
            <p>{`resource(location): ${service.resource.name}(${service.resource.location.name})`}</p>

            <p>{`created: ${format(
              IsoToDate(exceptionEvent.createdAt),
              "yyyy-MM-dd"
            )}`}</p>
            <p>
              {`created by: ${exceptionEvent.created_by.first_name} ${exceptionEvent.created_by.last_name}`}
            </p>

            <p>{`schedule: ${formatServiceSchedule({
              interval: service.interval,
              frequency: service.frequency,
              start_date: datedService.start_date,
              completion_date: datedService.completion_date,
            })}`}</p>
            <p className="font-bold">{`event date: ${format(
              IsoToDate(exceptionEvent.exception_date),
              "PPPP"
            )}`}</p>
          </div>

          <button
            type="button"
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
