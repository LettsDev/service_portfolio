import { IServiceEventException } from "../../types";
import { formatServiceSchedule } from "../../utils/calendarUtils";
import { IsoToDate } from "../../utils/dateConversion";
import { format } from "date-fns";
import { useAuth } from "../../context/auth.provider";
import AgendaButton from "./agendaButton";
export default function AgendaItem({ ev }: { ev: IServiceEventException }) {
  const { is_cancelled, is_rescheduled } = ev;
  const { interval, frequency, start_date, completion_date } = ev.service;
  const { isAuthorized, user } = useAuth();
  return (
    <>
      <tr className="hover cursor-default">
        <td className="mx-0.5">
          <div
            className="tooltip tooltip-right  sm:tooltip-top tooltip-accent text-accent-content text-xs "
            data-tip={formatServiceSchedule({
              interval,
              frequency,
              start_date: IsoToDate(start_date),
              completion_date: IsoToDate(completion_date),
            })}
          >
            <div className="card card-bordered bg-base-300 rounded-box p-2 text-base-content scale-75 sm:scale100">
              {ev.service.name}
            </div>
          </div>
        </td>
        <td className="mx-0.5">
          <div
            className="tooltip tooltip-top tooltip-accent text-accent-content text-xs"
            data-tip={
              ev.service.resource.notes !== ""
                ? `${ev.service.resource.notes}`
                : undefined
            }
          >
            <div className="card card-bordered bg-base-300 rounded-box p-2 text-base-content scale-75 sm:scale100">
              {`${ev.service.resource.name}(${ev.service.resource.location.name})`}
            </div>
          </div>
        </td>

        {is_cancelled || is_rescheduled ? (
          <td
            className={
              is_cancelled && is_rescheduled ? "flex flex-col gap-1 mx-0.5" : ""
            }
          >
            {is_cancelled ? (
              <div
                className="badge badge-warning tooltip tooltip-warning scale-75 sm:scale100"
                data-tip={`cancelled by ${ev.created_by.first_name} ${
                  ev.created_by.last_name
                } on ${format(IsoToDate(ev.updatedAt), "yyyy-MM-dd")}`}
              >
                cancelled
              </div>
            ) : undefined}
            {is_rescheduled ? (
              <div
                className="badge badge-accent tooltip tooltip-accent scale-90"
                data-tip={`rescheduled from ${format(
                  IsoToDate(ev.start_date),
                  "yyyy-MM-dd"
                )}`}
              >
                <div className="text-xs">rescheduled</div>
              </div>
            ) : undefined}
          </td>
        ) : null}

        <td
          colSpan={is_cancelled || is_rescheduled ? 1 : 2}
          className={`${is_cancelled ? "p-2" : "p-4"} sm:p-3`}
        >
          {is_cancelled ? (
            <div className="flex flex-col gap-1">
              {isAuthorized("ADMIN") ||
              (isAuthorized("ENHANCED") &&
                ev.service.created_by._id === user!._id) ? (
                <AgendaButton
                  type="link"
                  to={`cancel/${ev.service._id}/${ev.start_date}`}
                  text="restore"
                  isPrimary
                />
              ) : (
                <AgendaButton type="button" text="restore" />
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {isAuthorized("ADMIN") ||
              (isAuthorized("ENHANCED") &&
                ev.service.created_by._id === user!._id) ? (
                <>
                  <AgendaButton
                    type="link"
                    to={`reschedule/${ev.service._id}/${ev.start_date}`}
                    text={is_rescheduled ? "schedule" : "reschedule"}
                    isPrimary
                  />
                  <AgendaButton
                    type="link"
                    to={`cancel/${ev.service._id}/${ev.start_date}`}
                    text="cancel"
                    isPrimary={false}
                  />
                </>
              ) : (
                <>
                  <AgendaButton type="button" text="schedule" />
                  <AgendaButton type="button" text="cancel" />
                </>
              )}
            </div>
          )}
        </td>
      </tr>
    </>
  );
}
