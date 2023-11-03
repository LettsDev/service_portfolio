import { IServiceEventException } from "../../types";

export default function AgendaItem({ ev }: { ev: IServiceEventException }) {
  return (
    <tr className="hover">
      <td>{ev.service.name}</td>
      <td>
        <div>{ev.service.resource.name}</div>
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
            <a href={`reschedule/${ev._id}`} className="btn btn-primary btn-sm">
              reschedule
            </a>
            <a href="" className="btn btn-secondary btn-sm">
              cancel
            </a>
          </div>
        )}
      </td>
    </tr>
  );
}
