import { IServiceEventException } from "../../types";
import { formatServiceSchedule } from "../../utils/calendarUtils";
import { Link } from "react-router-dom";
import { IsoToDate } from "../../utils/dateConversion";
import { format } from "date-fns";
import { useAuth } from "../../context/auth.provider";
export default function AgendaItem({ ev }: { ev: IServiceEventException }) {
  const { is_cancelled, is_rescheduled } = ev;
  const { interval, frequency, start_date, completion_date } = ev.service;
  const { isAuthorized, user } = useAuth();
  return (
    <tr className="hover cursor-default">
      <td>
        <div
          className="tooltip"
          data-tip={formatServiceSchedule({
            interval,
            frequency,
            start_date: IsoToDate(start_date),
            completion_date: IsoToDate(completion_date),
          })}
        >
          {ev.service.name}
        </div>
      </td>
      <td>
        <div
          className="tooltip"
          data-tip={
            ev.service.resource.notes !== ""
              ? `note: ${ev.service.resource.notes}`
              : undefined
          }
        >
          {ev.service.resource.name}
        </div>
      </td>
      <td>
        <div className="text-center">{ev.service.resource.location.name}</div>
      </td>
      {is_cancelled || is_rescheduled ? (
        <td
          className={
            is_cancelled && is_rescheduled ? "flex flex-col gap-1" : ""
          }
        >
          {is_cancelled ? (
            <div
              className="badge badge-warning tooltip"
              data-tip={`cancelled by ${ev.created_by.first_name} ${
                ev.created_by.last_name
              } on ${format(IsoToDate(ev.updatedAt), "yyyy-MM-dd")}`}
            >
              cancelled
            </div>
          ) : undefined}
          {is_rescheduled ? (
            <div
              className="badge badge-accent tooltip"
              data-tip={`rescheduled from ${format(
                IsoToDate(ev.start_date),
                "yyyy-MM-dd"
              )}`}
            >
              rescheduled
            </div>
          ) : undefined}
        </td>
      ) : (
        <td></td>
      )}

      <td colSpan={is_cancelled || is_rescheduled ? 1 : 2}>
        {is_cancelled ? (
          <div className="flex flex-col gap-1">
            {isAuthorized("ADMIN") ||
            (isAuthorized("ENHANCED") &&
              ev.service.created_by._id === user!._id) ? (
              <Link
                to={`cancel/${ev.service._id}/${ev.start_date}`}
                className="btn btn-primary btn-sm"
              >
                restore
              </Link>
            ) : (
              <button type="button" disabled className="btn btn-primary btn-sm">
                restore
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {isAuthorized("ADMIN") ||
            (isAuthorized("ENHANCED") &&
              ev.service.created_by._id === user!._id) ? (
              <>
                <Link
                  to={`reschedule/${ev.service._id}/${ev.start_date}`}
                  className="btn btn-primary btn-sm"
                >
                  reschedule
                </Link>
                <Link
                  to={`cancel/${ev.service._id}/${ev.start_date}`}
                  className="btn btn-secondary btn-sm"
                >
                  cancel
                </Link>
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled
                  className="btn btn-primary btn-sm"
                >
                  reschedule
                </button>
                <button
                  type="button"
                  disabled
                  className="btn btn-primary btn-sm"
                >
                  cancel
                </button>
              </>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}
