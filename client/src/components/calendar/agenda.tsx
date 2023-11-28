import { IDateItem } from "../../types";
import AgendaItem from "./agendaItem";

type AgendaProps = {
  dateItems: IDateItem[];
  selectedDate: Date;
};
export default function Agenda({ dateItems, selectedDate }: AgendaProps) {
  return (
    <table className="table table-fixed">
      <thead>
        <tr>
          <td className="mx-0.5">Service</td>
          <td className="mx-0.5">Resource(Location)</td>
        </tr>
      </thead>
      <tbody>
        {dateItems

          .filter(
            (dateItem) => dateItem.date.getDate() === selectedDate.getDate()
          )
          .map((dateItem) => {
            return dateItem.events
              .sort()
              .map((ev) => <AgendaItem ev={ev} key={ev._id} />);
          })}
      </tbody>
    </table>
  );
}
