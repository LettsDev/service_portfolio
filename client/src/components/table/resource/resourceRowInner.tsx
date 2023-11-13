import { IServiceDated } from "../../../types";
import { formatServiceSchedule } from "../../../utils/calendarUtils";
export default function ResourceRowInner({
  datedServices,
}: {
  datedServices: IServiceDated[];
}) {
  return (
    <ul className="flex flex-col gap-2 justify-center">
      {datedServices.map((service) => (
        <li key={service._id}>
          <div
            className="tooltip tooltip-top dark:tooltip-accent cursor-default"
            data-tip={formatServiceSchedule({
              interval: service.interval,
              frequency: service.frequency,
              start_date: service.start_date,
              completion_date: service.completion_date,
            })}
          >
            <div className="badge badge-neutral dark:badge-accent">
              {service.name}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
