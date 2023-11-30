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
      className={`cursor-pointer text-center p-1 rounded-full lg:text-xl lg:h-20  ${
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
      } ${
        dateItem.date.getMonth() !== selectedDate.getMonth()
          ? "opacity-60"
          : null
      }`}
      onClick={handleClick}
    >
      <div>{dateItem.date.getDate()}</div>
      <div className="flex justify-center gap-1">
        {dateItem.events.map((event, index) => {
          if (index < 3) {
            return (
              <div
                className="w-1.5 h-1.5 bg-secondary rounded sm:w-2 sm:h-2"
                key={event.service.name}
              ></div>
            );
          }
        })}
      </div>
    </td>
  );
}
