import { IServiceEventException } from "../../types";
import { formatServiceSchedule } from "../../utils/calendarUtils";
import { Link } from "react-router-dom";
export default function AgendaItem({ ev }: { ev: IServiceEventException }) {
  const { interval, frequency, start_date, completion_date } = ev.service;
  return (
    <tr className="hover cursor-default">
      <td>
        <div
          className="tooltip t"
          data-tip={formatServiceSchedule({
            interval,
            frequency,
            start_date,
            completion_date,
          })}
        >
          {ev.service.name}
        </div>
      </td>
      <td>
        <div className="">{ev.service.resource.name}</div>
      </td>
      <td>
        <div className="badge badge-neutral">
          {ev.service.resource.location.name}
        </div>
      </td>
      <td>
        {ev.is_cancelled ? (
          // TODO cancelled styling
          <p>Cancelled</p>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              to={`reschedule/${ev.service._id}/${ev.start_date}`}
              className="btn btn-primary btn-sm"
            >
              reschedule
            </Link>
            <a href="" className="btn btn-secondary btn-sm">
              cancel
            </a>
          </div>
        )}
      </td>
    </tr>
  );
}
