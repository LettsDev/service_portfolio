import { useState, useEffect, useRef } from "react";
import { IService, IServiceEventException, IDateItem } from "../types";
import fetchWithCatch from "../utils/fetchWithCatch";
import { startOfMonth, endOfMonth } from "date-fns";
import { useLoaderData } from "react-router-dom";
import { convertFromDateToIsoString } from "../utils/dateConversion";

import useCalendarEvents from "./useCalendarEvents";
export default function useCalendar() {
  //These are loaded in based on the current month for the initial calendar view
  const { initialServices, initialEventExceptions } = useLoaderData() as {
    initialServices: IService[];
    initialEventExceptions: IServiceEventException[];
  };
  const previousSelectedMonthRef = useRef(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateItems, setDateItems] = useState<IDateItem[]>([]);
  const { createDateItems } = useCalendarEvents();

  useEffect(() => {
    const dates = createDateItems(
      selectedDate,
      initialServices,
      initialEventExceptions
    );
    setDateItems(dates);
  }, []);

  useEffect(() => {
    //When a user changes the month shown, the services that intersect the month and event exceptions are retrieved
    async function fetchServicesAndEventExceptions(newDate: Date) {
      const start = convertFromDateToIsoString(startOfMonth(newDate));
      const end = convertFromDateToIsoString(endOfMonth(newDate));

      const refreshedServices = await fetchWithCatch<IService[]>({
        //Services that are within the date range (start less than endDate & completion_date after start date)
        url: `service/${start}/${end}`,
        method: "get",
      });
      const refreshedServiceEvents = await fetchWithCatch<
        IServiceEventException[]
      >({
        // Event Exceptions that are:
        //A. from the services which occur during the time period
        //B.event exceptions that occur during the time period (from services that may have a range outside of the time period but the event exceptions have been rescheduled to be during the time period)
        url: `serviceEvent/${start}/${end}`,
        method: "get",
      });
      return { refreshedServices, refreshedServiceEvents };
    }
    //will only make and API call if the user changes the month
    if (previousSelectedMonthRef.current === selectedDate.getMonth()) {
      return;
    }
    previousSelectedMonthRef.current = selectedDate.getMonth();
    fetchServicesAndEventExceptions(selectedDate).then(
      ({ refreshedServices, refreshedServiceEvents }) => {
        const dates = createDateItems(
          selectedDate,
          refreshedServices,
          refreshedServiceEvents
        );
        setDateItems(dates);
        console.log(dates);
      }
    );
  }, [selectedDate, createDateItems]);

  return { selectedDate, setSelectedDate, dateItems };
}
