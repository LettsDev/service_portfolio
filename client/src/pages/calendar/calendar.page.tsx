import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { format, addMonths, subMonths } from "date-fns";
import useCalendar from "../../hooks/useCalendar";
import { IDateItem, IServiceEventException } from "../../types";
import Cell from "../../components/calendar/cell";
import Agenda from "../../components/calendar/agenda";
import { Outlet, useOutletContext } from "react-router-dom";
import Loading from "../../components/loading";
export default function Calendar() {
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const {
    selectedDate,
    setSelectedDate,
    dateItems,
    loading,
    setLoading,
    rescheduleEvent,
    cancelEvent,
  } = useCalendar();

  const CreateMonthElements = ({
    dateItems,
    selectedDate,
    setSelectedDate,
  }: {
    dateItems: IDateItem[];
    selectedDate: Date;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  }): JSX.Element[] => {
    const week: JSX.Element[] = [];
    const month: JSX.Element[] = [];
    dateItems.forEach((dateItem, index) => {
      if (index % 7 !== 0) {
        week.push(
          <Cell
            dateItem={dateItem}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            key={dateItem.date.toString()}
          />
        );
      } else {
        const weekCopy = week.slice();
        month.push(<tr key={index}>{...weekCopy}</tr>);
        week.length = 0;
        week.push(
          <Cell
            dateItem={dateItem}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            key={dateItem.date.toString()}
          />
        );
      }

      if (index === dateItems.length - 1) {
        const weekCopy = week.slice();
        month.push(<tr key={index}>{...weekCopy}</tr>);
      }
    });
    return month;
  };
  return (
    <div className="flex justify-center mt-4">
      <div className="flex flex-col max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl ">
        {/* tool bar */}
        <div className="flex justify-between grow items-center mx-2 sm:mx-4 lg:mx-8">
          <button
            className="btn cursor-pointer"
            onClick={() => setSelectedDate((current) => subMonths(current, 1))}
            aria-label="go back a month"
          >
            {<FaArrowLeft />}
          </button>
          <p
            className=" font-bold cursor-pointer p-3 text-lg font-serif lg:text-2xl"
            onClick={() => setSelectedDate(new Date())}
          >
            {format(selectedDate, "LLLL yyyy")}
          </p>
          <button
            className="btn cursor-pointer"
            aria-label="go forward a month"
            onClick={() => setSelectedDate((current) => addMonths(current, 1))}
          >
            {<FaArrowRight />}
          </button>
        </div>
        <table className="table-fixed w-full">
          <thead>
            <tr>
              {dayLabels.map((label) => (
                <th className="" key={label}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td>
                  <Loading />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              <CreateMonthElements
                dateItems={dateItems}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </tbody>
          )}
        </table>
        <Agenda dateItems={dateItems} selectedDate={selectedDate} />
      </div>
      <Outlet context={{ loading, rescheduleEvent, cancelEvent, setLoading }} />
    </div>
  );
}

type ContextType = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  rescheduleEvent: (
    editedExceptionEvent: IServiceEventException,
    originalEventDate: Date
  ) => Promise<void>;
  cancelEvent: (cancelledEvent: IServiceEventException) => Promise<void>;
};
export const useCalendarContext = () => {
  return useOutletContext<ContextType>();
};
