import { IDateItem } from "../../types";

export default function Cell({
  dateItem,
  selectedDate,
  setSelectedDate,
}: {
  dateItem: IDateItem;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}) {
  function handleClick() {
    setSelectedDate(dateItem.date);
  }

  return (
    <td
      className={`cursor-pointer text-center align-top p-1 rounded-full  ${
        selectedDate.getDate() === dateItem.date.getDate() &&
        selectedDate.getMonth() === dateItem.date.getMonth()
          ? " bg-primary text-primary-content"
          : ""
      } ${
        dateItem.date.getDate() === new Date().getDate() &&
        dateItem.date.getMonth() === new Date().getMonth() &&
        dateItem.date.getFullYear() === new Date().getFullYear()
          ? "font-bold"
          : ""
      } `}
      onClick={handleClick}
    >
      <div>{dateItem.date.getDate()}</div>
      <div className="flex justify-center gap-1">
        {dateItem.events.map((event, index) => {
          if (index < 3) {
            return (
              <div
                className="w-1.5 h-1.5 bg-primary-content rounded"
                key={event.service.name}
              ></div>
            );
          }
        })}
      </div>
    </td>
  );
}
