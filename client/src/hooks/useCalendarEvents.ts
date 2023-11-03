import { add, isSameDay } from "date-fns";
import { IService, IServiceEventException, IDateItem } from "../types";
import {
  createEmptyDateItems,
  withinRange,
  getWeeklyStartDate,
  getMonthlyStartDate,
  getAnnuallyStartDate,
  filterEventsByRange,
  createEvent,
  lowerCalendarWeekOverlap,
  upperCalendarWeekOverlap,
} from "../utils/calendarUtils";

export default function useCalendarEvents() {
  function processService(
    service: IService,
    lowerDateRange: Date,
    upperDateRange: Date,
    serviceEventExceptions: IServiceEventException[]
  ): IServiceEventException[] {
    const events: IServiceEventException[] = [];
    // 1. event is already in the exception list and within the time range (exception_date within time period)
    // 2. event is already in the exception list and not within the time range (start_date within the time period)
    // 3. event is not in the exception list (create a new event and push to events if within time period)

    //these are the events that are from this service
    const eventExceptionsFilteredByService = serviceEventExceptions.filter(
      (evnt) => evnt.service._id === service._id
    );

    switch (service.frequency) {
      case "ONCE":
        if (eventExceptionsFilteredByService.length !== 0) {
          // is there already an event exception for this service?
          const exceptionsEvent = eventExceptionsFilteredByService[0];
          if (
            withinRange(
              new Date(exceptionsEvent.exception_date),
              lowerDateRange,
              upperDateRange
            )
          ) {
            // if event exception, exception date is within time period
            return eventExceptionsFilteredByService;
          }
          //outside time period
          return [];
        }
        //no valid exception event
        return [createEvent(service)];

      case "DAILY":
        for (
          let date = new Date(service.start_date);
          date <= new Date(service.completion_date);
          date = add(date, { days: service.interval })
        ) {
          //does the date occur during the time range?
          if (withinRange(date, lowerDateRange, upperDateRange)) {
            //we have event exceptions for this service
            if (eventExceptionsFilteredByService.length > 0) {
              const index = eventExceptionsFilteredByService.findIndex(
                (eventException) =>
                  isSameDay(new Date(eventException.start_date), date) &&
                  withinRange(
                    new Date(eventException.exception_date),
                    lowerDateRange,
                    upperDateRange
                  )
              );
              //we have an event exception from this date (start_date) that also falls within the date range
              if (index !== -1) {
                events.push(eventExceptionsFilteredByService[index]);
                continue;
              }
            }
            //there are no event exceptions for this service OR there are event exceptions but none are from this date.
            events.push(createEvent(service, date));
          }
        }
        return events;

      case "WEEKLY":
        for (
          let date = getWeeklyStartDate(
            new Date(service.start_date),
            service.interval
          );
          date <= new Date(service.completion_date);
          date = add(date, { weeks: 1 })
        ) {
          //does the date occur during the time range?
          if (withinRange(date, lowerDateRange, upperDateRange)) {
            //we have event exceptions for this service
            if (eventExceptionsFilteredByService.length > 0) {
              const index = eventExceptionsFilteredByService.findIndex(
                (eventException) =>
                  isSameDay(new Date(eventException.start_date), date) &&
                  withinRange(
                    new Date(eventException.exception_date),
                    lowerDateRange,
                    upperDateRange
                  )
              );
              //we have an event exception from this date (start_date) that also falls within the date range
              if (index !== -1) {
                events.push(eventExceptionsFilteredByService[index]);
                continue;
              }
            }
            //there are no event exceptions for this service OR there are event exceptions but none are from this date.
            events.push(createEvent(service, date));
          }
        }
        return events;
      case "MONTHLY":
        for (
          let date = getMonthlyStartDate(
            new Date(service.start_date),
            service.interval
          );
          date <= new Date(service.completion_date);
          date = add(date, { months: 1 })
        ) {
          //does the date occur during the time range?
          if (withinRange(date, lowerDateRange, upperDateRange)) {
            //we have event exceptions for this service
            if (eventExceptionsFilteredByService.length > 0) {
              const index = eventExceptionsFilteredByService.findIndex(
                (eventException) =>
                  isSameDay(new Date(eventException.start_date), date) &&
                  withinRange(
                    new Date(eventException.exception_date),
                    lowerDateRange,
                    upperDateRange
                  )
              );
              //we have an event exception from this date (start_date) that also falls within the date range
              if (index !== -1) {
                events.push(eventExceptionsFilteredByService[index]);
                continue;
              }
            }
            //there are no event exceptions for this service OR there are event exceptions but none are from this date.
            events.push(createEvent(service, date));
          }
        }
        return events;
      case "ANNUALLY":
        for (
          let date = getAnnuallyStartDate(
            new Date(service.start_date),
            service.interval
          );
          date <= new Date(service.completion_date);
          date = add(date, { months: 1 })
        ) {
          const eventException = filterEventsByRange(
            eventExceptionsFilteredByService,
            date,
            lowerDateRange,
            upperDateRange
          );
          if (eventException) {
            events.push(eventException);
          }
          if (withinRange(date, lowerDateRange, upperDateRange)) {
            events.push(createEvent(service, date));
          }
        }
        return events;
      default:
        return [];
    }
  }

  function createEvents(
    lowerDateRange: Date,
    upperDateRange: Date,
    services: IService[],
    serviceEventExceptions: IServiceEventException[]
  ) {
    //steps
    //1. create the empty date items for the month
    const dateItems = createEmptyDateItems(lowerDateRange, upperDateRange);
    const events: IServiceEventException[] = [];
    //2. loop through the services and create events that are occurring within the date range if:
    // - event is not included in the event exceptions (if it is then does the exception date fall within the date range -> if so then include)
    // - if the created event will fall within the date range

    services.forEach((service) => {
      const eventsFromWithinDateRange = processService(
        service,
        lowerDateRange,
        upperDateRange,
        serviceEventExceptions
      );
      events.push(...eventsFromWithinDateRange);
    });
    // event exceptions that are not being generated from the time period but the exception date is within the time period
    //These are exceptions events that were rescheduled to within the date range

    const servicesFromOutsideDateRange = serviceEventExceptions.filter(
      (evnt) =>
        withinRange(
          new Date(evnt.exception_date),
          lowerDateRange,
          upperDateRange
        ) &&
        !withinRange(new Date(evnt.start_date), lowerDateRange, upperDateRange)
    );
    events.push(...servicesFromOutsideDateRange);
    console.log(
      "services from outside Date Range: ",
      servicesFromOutsideDateRange
    );
    //parse events and match with dateItems
    events.forEach((evnt) => {
      const foundDateItemIndex = dateItems.findIndex((dateItem) => {
        const dateItemDate = dateItem.date;
        const eventExceptionDate = new Date(evnt.exception_date);
        return (
          dateItemDate.getUTCDate() === eventExceptionDate.getUTCDate() &&
          dateItemDate.getUTCMonth() === eventExceptionDate.getUTCMonth()
        );
      });
      if (foundDateItemIndex === -1) {
        console.log("couldn't find the correct date for the event:", evnt);
        throw Error("Date Error");
      }
      dateItems[foundDateItemIndex].events.push(evnt);
    });
    return dateItems;
  }

  function createDateItems(
    selectedDate: Date,
    services: IService[],
    serviceEventExceptions: IServiceEventException[]
  ): IDateItem[] {
    const lowerDateRange = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );
    const upperDateRange = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    );
    //these are the date items that are from other months that are still included in the displayed calendar
    const lowerFill = lowerCalendarWeekOverlap(lowerDateRange);
    const upperFill = upperCalendarWeekOverlap(upperDateRange);

    const datesOfCurrentMonth = createEvents(
      lowerDateRange,
      upperDateRange,
      services,
      serviceEventExceptions
    );

    return [...lowerFill, ...datesOfCurrentMonth, ...upperFill];
  }

  return { createDateItems };
}
