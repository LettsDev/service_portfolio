import { useState, useEffect, useRef } from "react";
import useFetchWithCatch from "./useFetchWithCatch";
import {
  IService,
  IServiceEventException,
  IDateItem,
  IServiceEventExceptionSubmit,
} from "../types";
import { startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { useLoaderData } from "react-router-dom";
import {
  IsoToDate,
  convertFromDateToIsoString,
  dateToIso,
  toIServiceDated,
} from "../utils/dateConversion";
import useCalendarEvents from "./useCalendarEvents";
export default function useCalendar() {
  //These are loaded in based on the current month for the initial calendar view
  const { fetchWithCatch } = useFetchWithCatch();
  const { initialServices, initialEventExceptions } = useLoaderData() as {
    initialServices: IService[];
    initialEventExceptions: IServiceEventException[];
  };
  const previousSelectedMonthRef = useRef({ month: 0, year: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateItems, setDateItems] = useState<IDateItem[]>([]);
  const { createDateItems } = useCalendarEvents();
  const [loading, setLoading] = useState(false);
  async function load() {
    //load services & event exceptions
    setLoading(true);
    const services = await fetchWithCatch<IService[]>({
      url: `service/${convertFromDateToIsoString(
        startOfMonth(selectedDate)
      )}/${convertFromDateToIsoString(endOfMonth(selectedDate))}`,
      method: "get",
    });
    const serviceEventExceptions = await fetchWithCatch<
      IServiceEventException[]
    >({
      url: `serviceEvent/${convertFromDateToIsoString(
        startOfMonth(selectedDate)
      )}/${convertFromDateToIsoString(endOfMonth(selectedDate))}`,
      method: "get",
    });

    const dates = createDateItems(
      selectedDate,
      services.map((service) => toIServiceDated(service)),
      serviceEventExceptions
    );
    setDateItems(dates);
    setLoading(false);
  }
  useEffect(() => {
    if (!initialServices || !initialEventExceptions) {
      console.log("no initial services");
      load();
      return;
    }
    //if there are no initial services (reload) then load them again
    const dates = createDateItems(
      selectedDate,
      initialServices.map((service) => toIServiceDated(service)),
      initialEventExceptions
    );
    setDateItems(dates);
  }, []);

  useEffect(() => {
    //When a user changes the month shown, the services that intersect the month and event exceptions are retrieved
    async function fetchServicesAndEventExceptions(newDate: Date) {
      const start = dateToIso(startOfMonth(newDate));
      const end = dateToIso(endOfMonth(newDate));

      const refreshedServices = await fetchWithCatch<IService[]>({
        //Services that are within the date range (start less than endDate & completion_date after start date)
        url: `service/${start}/${end}`,
        method: "get",
      });
      const refreshedDatedServices = refreshedServices.map((service) =>
        toIServiceDated(service)
      );
      const refreshedServiceEvents = await fetchWithCatch<
        IServiceEventException[]
      >({
        // Event Exceptions that are:
        //A. from the services which occur during the time period
        //B.event exceptions that occur during the time period (from services that may have a range outside of the time period but the event exceptions have been rescheduled to be during the time period)
        url: `serviceEvent/${start}/${end}`,
        method: "get",
      });
      const dates = createDateItems(
        selectedDate,
        refreshedDatedServices,
        refreshedServiceEvents
      );
      setDateItems(dates);
      console.log(dates);
    }
    if (
      previousSelectedMonthRef.current.month === selectedDate.getMonth() &&
      previousSelectedMonthRef.current.year === selectedDate.getFullYear()
    ) {
      return;
    }
    previousSelectedMonthRef.current.month = selectedDate.getMonth();
    previousSelectedMonthRef.current.year = selectedDate.getFullYear();
    setLoading(true);
    fetchServicesAndEventExceptions(selectedDate);
    setLoading(false);
  }, [selectedDate, createDateItems, fetchWithCatch]);

  async function rescheduleEvent(
    editedExceptionEvent: IServiceEventException,
    originalEventDate: Date
  ) {
    setLoading(true);
    const { _id, ...sanitizedEvent } = editedExceptionEvent;
    const submittedEditedEventException: IServiceEventExceptionSubmit = {
      ...sanitizedEvent,
      created_by: editedExceptionEvent.created_by._id,
      service: editedExceptionEvent.service._id,
    };
    const editedEvent = await fetchWithCatch<IServiceEventException>({
      url: "/serviceEvent",
      method: "post",
      data: submittedEditedEventException,
    });
    const dateItemIndex = dateItems.findIndex((dateItem) =>
      isSameDay(dateItem.date, originalEventDate)
    );
    // should this be the first time the event is scheduled we do not have the _id for the event
    const eventIndex = dateItems[dateItemIndex].events.findIndex(
      (eventException) =>
        eventException._id === editedExceptionEvent._id ||
        (eventException.service._id === editedExceptionEvent.service._id &&
          eventException.start_date === editedExceptionEvent.start_date)
    );
    const editedDateItems = dateItems;
    //remove the old event
    editedDateItems[dateItemIndex].events.splice(eventIndex, 1);
    const movedToDateIndex = editedDateItems.findIndex((dateItem) =>
      isSameDay(
        dateItem.date,
        IsoToDate(submittedEditedEventException.exception_date)
      )
    );
    //move to new location
    editedDateItems[movedToDateIndex].events.push(editedEvent);
    setDateItems(editedDateItems);
    setLoading(false);
  }

  async function cancelEvent(cancelledExceptionEvent: IServiceEventException) {
    setLoading(true);
    const { _id, ...sanitizedEvent } = cancelledExceptionEvent;
    const submittedCancelledEventException: IServiceEventExceptionSubmit = {
      ...sanitizedEvent,
      created_by: cancelledExceptionEvent.created_by._id,
      service: cancelledExceptionEvent.service._id,
    };
    const cancelledEvent = await fetchWithCatch<IServiceEventException>({
      url: "/serviceEvent",
      method: "post",
      data: submittedCancelledEventException,
    });
    const editedDateItems = dateItems;
    const dateItemIndex = dateItems.findIndex((dateItem) => {
      return isSameDay(dateItem.date, IsoToDate(cancelledEvent.exception_date));
    });
    const eventIndex = dateItems[dateItemIndex].events.findIndex(
      (exceptionEvent) =>
        exceptionEvent.service._id === cancelledExceptionEvent.service._id &&
        isSameDay(
          IsoToDate(exceptionEvent.start_date),
          IsoToDate(cancelledExceptionEvent.start_date)
        )
    );
    editedDateItems[dateItemIndex].events[eventIndex].is_cancelled =
      !dateItems[dateItemIndex].events[eventIndex].is_cancelled;
    setDateItems(editedDateItems);
    setLoading(false);
  }
  return {
    selectedDate,
    setSelectedDate,
    dateItems,
    loading,
    setLoading,
    rescheduleEvent,
    cancelEvent,
  };
}
