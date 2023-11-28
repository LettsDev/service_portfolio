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
        <li key={service._id} className="cursor-default">
          <div
            className="tooltip tooltip-top tooltip-accent scale-75 sm:scale-100"
            data-tip={formatServiceSchedule({
              interval: service.interval,
              frequency: service.frequency,
              start_date: service.start_date,
              completion_date: service.completion_date,
            })}
          >
            <div className="card card-bordered bg-base-300 rounded-box p-2 text-base-content text-xs sm:text-base">
              {service.name}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
