import { useState } from "react";
import { IServiceDated } from "../../../types";
import TableRowButtons from "../tableRowButtons";
import { formatServiceSchedule } from "../../../utils/calendarUtils";
export default function ServiceRow({ service }: { service: IServiceDated }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr
        onClick={() => setOpen(!open)}
        className="cursor-pointer hover:bg-accent hover:text-white"
      >
        <td className="font-medium">{service.name}</td>
        <td className="font-medium">{`${service.resource.name}(${service.resource.location.name})`}</td>
        <td></td>
      </tr>
      {open && (
        <tr className="bg-base-200">
          <td>
            <div className="flex flex-col gap-2">
              <p className="badge text-xs md:text-sm">
                created: {new Date(service.createdAt).toLocaleDateString()}
              </p>
              <p className="badge text-xs md:text-sm">
                {`last updated: ${new Date(
                  service.updatedAt
                ).toLocaleDateString()}`}
              </p>
            </div>
          </td>
          <td className="flex flex-col gap-2">
            <p className="badge text-xs md:text-sm">
              created by: {service.created_by.first_name}{" "}
              {service.created_by.last_name}
            </p>
            <p className="badge badge-lg text-xs md:text-sm">
              {`${formatServiceSchedule({
                interval: service.interval,
                frequency: service.frequency,
                start_date: service.start_date,
                completion_date: service.completion_date,
              })}`}
            </p>
          </td>
          <td>
            <TableRowButtons id={service._id} />
          </td>
        </tr>
      )}
    </>
  );
}
