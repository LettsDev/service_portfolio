import {
  getDate,
  subDays,
  setDayOfYear,
  isSameDay,
  isBefore,
  setDay,
  addDays,
  getDaysInMonth,
  format,
} from "date-fns";
import { IDateItem, IServiceEventException, IService } from "../types";
import { daysIntoYear, dateIntoDays, getNextDay } from "./dateConversion";

// **************************** Formatting Service Schedules ****************************
export const formatServiceSchedule = ({
  interval,
  frequency,
  start_date,
  completion_date,
}: Pick<
  IService,
  "interval" | "frequency" | "start_date" | "completion_date"
>) => {
  switch (frequency) {
    case "ONCE":
      return `ONCE on ${new Date(start_date)
        .toUTCString()
        .split(" ")
        .slice(0, 4)
        .join(" ")}`;
    case "DAILY":
      return `  ${
        interval > 1 ? `EVERY ${interval} days` : "EVERYDAY"
      }, starting ${new Date(start_date)
        .toUTCString()
        .split(" ")
        .slice(0, 4)
        .join(" ")} till ${new Date(completion_date)
        .toUTCString()
        .split(" ")
        .slice(0, 4)
        .join(" ")}`;
    case "WEEKLY":
      return `${format(
        setDay(new Date(new Date().getFullYear(), 1, 1), interval),
        "cccc"
      )}s, starting ${new Date(start_date)
        .toUTCString()
        .split(" ")
        .slice(0, 4)
        .join(" ")} till ${new Date(completion_date)
        .toUTCString()
        .split(" ")
        .slice(0, 4)
        .join(" ")}`;
    case "MONTHLY":
      return `${format(
        new Date(`2023-1-${interval}`),
        "do"
      )} of every month, starting ${new Date(
        start_date
      ).toLocaleDateString()} till ${new Date(
        completion_date
      ).toLocaleDateString()} `;
    case "ANNUALLY":
      return `${format(
        setDayOfYear(
          new Date(
            +start_date.split("-")[0],
            +start_date.split("-")[1],
            interval
          ),
          interval + 1
        ),
        "MMMM-do"
      )}, starting ${new Date(start_date).getFullYear()} till ${new Date(
        completion_date
      ).getFullYear()} `;
    default:
      break;
  }
};

// **************************** Date Item Creation ****************************
export const createDateItem = (
  date: Date,
  events?: IServiceEventException[]
): IDateItem => {
  return { date, events: events ? events : [] };
};

export const createEmptyDateItems = (
  lowerDateRange: Date,
  upperDateRange: Date
): IDateItem[] => {
  if (lowerDateRange > upperDateRange) {
    throw Error("the lowerDateRange needs to be before the upperDateRange");
  }
  if (getDate(lowerDateRange) === getDate(upperDateRange)) {
    return [];
  }
  let dayPointer = lowerDateRange;
  const days: IDateItem[] = [];
  while (dayPointer <= upperDateRange) {
    days.push(createDateItem(dayPointer));
    dayPointer = addDays(dayPointer, 1);
  }

  return days;
};

// **************************** Exception Event ****************************

export const createEvent = (
  service: IService,
  date?: Date
): IServiceEventException => {
  const base = {
    is_cancelled: false,
    is_rescheduled: false,
    __v: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return {
    _id: crypto.randomUUID(),
    service: service,
    exception_date: date
      ? date.toISOString()
      : new Date(service.start_date).toISOString(),
    start_date: date
      ? date.toISOString()
      : new Date(service.start_date).toISOString(),
    created_by: service.created_by,
    ...base,
  };
};

// **************************** Outside Range Date Items ****************************

export const lowerCalendarWeekOverlap = (lowerDateRange: Date): IDateItem[] => {
  //the days that show up on the calendar outside of the selected time period, but still within the same week containing the lowerDateRange
  // the start of the week is Sunday (index 0)
  const dateItems = [];
  const weekIndex = lowerDateRange.getDay();

  if (weekIndex === 0) {
    return [];
  }
  for (let day = weekIndex; day > 0; day--) {
    dateItems.push(createDateItem(subDays(lowerDateRange, day)));
  }
  return dateItems;
};

export function upperCalendarWeekOverlap(upperDateRange: Date): IDateItem[] {
  const dateItems = [];
  const weekIndex = upperDateRange.getDay();
  if (weekIndex === 6) {
    return [];
  }
  for (let day = 1; day < 7 - weekIndex; day++) {
    dateItems.push(createDateItem(addDays(upperDateRange, day)));
  }
  return dateItems;
}

// **************************** Date Range narrowing / calculating start dates ****************************

export const withinRange = (
  date: Date,
  lowerDateRange: Date,
  upperDateRange: Date
): boolean => {
  if (
    date.getUTCDate() >= lowerDateRange.getUTCDate() &&
    date.getUTCMonth() >= lowerDateRange.getUTCMonth() &&
    date.getUTCFullYear() >= lowerDateRange.getUTCFullYear() &&
    date.getUTCDate() <= upperDateRange.getUTCDate() &&
    date.getUTCMonth() <= upperDateRange.getUTCMonth() &&
    date.getUTCFullYear() <= upperDateRange.getUTCFullYear()
  ) {
    return true;
  }
  return false;
};

export const getWeeklyStartDate = (start_date: Date, interval: number) => {
  // the start_date is setting the starting week
  const delta = interval - start_date.getUTCDay();

  if (delta < 0) {
    return subDays(start_date, delta);
  }
  if (delta > 0) {
    return addDays(start_date, delta);
  }
  return start_date;
};

export const getMonthlyStartDate = (start_date: Date, interval: number) => {
  const startDay = start_date.getDate();
  const currentMonth = start_date.getMonth();
  const currentYear = start_date.getFullYear();
  const nextMonth = new Date(currentYear, currentMonth + 1, 3);
  const daysInNextMonth = getDaysInMonth(nextMonth);
  if (startDay !== interval) {
    if (startDay > interval) {
      // go to the next month
      if (daysInNextMonth < interval) {
        //next month has fewer days than the interval.. so go to the last day in the month
        nextMonth.setDate(daysInNextMonth);
        return nextMonth;
      }
      nextMonth.setDate(interval);
      return nextMonth;
    }
    const sameMonthInterval = start_date;
    sameMonthInterval.setDate(interval - 1);
    return sameMonthInterval;
  }
  return start_date;
};

export const getAnnuallyStartDate = (start_date: Date, interval: number) => {
  const dayOfYear = daysIntoYear(start_date);
  const startDateInterval = daysIntoYear(start_date);
  const currentYear = start_date.getUTCFullYear();
  const nextYear = currentYear + 1;
  if (dayOfYear !== interval) {
    if (startDateInterval > interval) {
      if (
        (nextYear % 4 === 0 && nextYear % 400 === 0) ||
        nextYear % 100 !== 0
      ) {
        //the next year is a leap year
        if (interval > 59) {
          //leap years have a February 29th which is the 60th day of the year
          // if interval is after then add 1
          return dateIntoDays(interval + 1, nextYear);
        }
      }
      // return next year at the interval
      return dateIntoDays(interval, nextYear);
    }
    return setDayOfYear(start_date, interval);
  }
  return start_date;
};

export const filterEventsByRange = (
  eventsByService: IServiceEventException[],
  date: Date,
  lowerDateRange: Date,
  upperDateRange: Date
) => {
  if (withinRange(date, lowerDateRange, upperDateRange)) {
    if (eventsByService.length !== 0) {
      // we only care about the event that started on this date
      // the event will either occur during this time period or outside of it
      const startOnThisDateEvent = eventsByService.find((evnt) =>
        isSameDay(new Date(evnt.start_date), date)
      );
      if (startOnThisDateEvent) {
        if (
          withinRange(
            new Date(startOnThisDateEvent.exception_date),
            lowerDateRange,
            upperDateRange
          )
        ) {
          return startOnThisDateEvent;
        }
      }
    }
  }
  return null;
};
