import { useState } from "react";
import { format } from "date-fns";
import { IServiceDated } from "../../../types";
import TableRowButtons from "../tableRowButtons";
import { formatServiceSchedule } from "../../../utils/calendarUtils";
import { useAuth } from "../../../context/auth.provider";
import Stat from "../stat";
export default function ServiceRow({ service }: { service: IServiceDated }) {
  const [open, setOpen] = useState(false);
  const { user, isAuthorized } = useAuth();
  return (
    <>
      <tr
        onClick={() => setOpen(!open)}
        className="cursor-pointer hover:bg-accent hover:text-accent-content"
      >
        <td>{service.name}</td>
        <td>{`${service.resource.name}(${service.resource.location.name})`}</td>
        <td></td>
      </tr>
      {open && (
        <tr className="bg-base-200">
          <td>
            <div className="flex flex-col gap-2">
              <Stat
                label="created"
                info={format(new Date(service.createdAt), "PP")}
              />
              <Stat
                label="updated"
                info={format(new Date(service.updatedAt), "PP")}
              />
              <Stat
                label="created by"
                info={`${service.created_by.first_name} ${service.created_by.last_name}`}
              />
            </div>
          </td>
          <td className="flex flex-col gap-2">
            <Stat
              label="schedule"
              info={`${formatServiceSchedule({
                interval: service.interval,
                frequency: service.frequency,
                start_date: service.start_date,
                completion_date: service.completion_date,
              })}`}
            />
          </td>
          <td className="text-center">
            <TableRowButtons
              id={service._id}
              editDisabled={
                !(
                  (user!._id === service.created_by._id &&
                    isAuthorized("ENHANCED")) ||
                  isAuthorized("ADMIN")
                )
              }
              deleteDisabled={
                !(
                  (isAuthorized("ENHANCED") &&
                    user!._id === service.created_by._id) ||
                  isAuthorized("ADMIN")
                )
              }
            />
          </td>
        </tr>
      )}
    </>
  );
}
