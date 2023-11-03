import { IDateItem } from "../../types";
import AgendaItem from "./agendaItem";

type AgendaProps = {
  dateItems: IDateItem[];
  selectedDate: Date;
};
export default function Agenda({ dateItems, selectedDate }: AgendaProps) {
  return (
    <table className="table">
      <thead>
        <tr>
          <td>Service</td>
          <td>Resource</td>
          <td>Location</td>
          <td></td>
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
