import {
  getDate,
  subDays,
  setDayOfYear,
  isSameDay,
  setDay,
  addDays,
  getDaysInMonth,
  format,
  set,
  getDayOfYear,
  isLeapYear,
} from "date-fns";
import { IDateItem, IServiceEventException, IServiceDated } from "../types";
import { toIService } from "./dateConversion";

// **************************** Formatting Service Schedules ****************************
export const formatServiceSchedule = ({
  interval,
  frequency,
  start_date,
  completion_date,
}: Pick<
  IServiceDated,
  "interval" | "frequency" | "start_date" | "completion_date"
>) => {
  switch (frequency) {
    case "ONCE":
      return `Once on ${format(new Date(start_date), "PP")}
        `;

    case "DAILY":
      return `  ${
        interval > 1 ? `Every ${interval} days` : "Everyday"
      }, starting ${format(new Date(start_date), "PP")} till ${format(
        new Date(completion_date),
        "PP"
      )}`;

    case "WEEKLY":
      return `${format(
        setDay(new Date(new Date().getFullYear(), 1, 1), interval),
        "cccc"
      )}s, starting week of ${format(
        new Date(start_date),
        "PP"
      )} till week of ${format(new Date(completion_date), "PP")}`;

    case "MONTHLY":
      return `${format(
        new Date(`2023-1-${interval}`),
        "do"
      )} of every month, starting ${format(
        start_date,
        "LLLL, yyyy"
      )} till ${format(completion_date, "LLLL, yyyy")} `;

    case "ANNUALLY":
      return `${format(
        setDayOfYear(start_date, interval),
        "MMMM, do"
      )} starting ${start_date.getFullYear()} till ${completion_date.getFullYear()} `;
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
  service: IServiceDated,
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
    service: toIService(service),
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
    date.getDate() >= lowerDateRange.getDate() &&
    date.getMonth() >= lowerDateRange.getMonth() &&
    date.getFullYear() >= lowerDateRange.getFullYear() &&
    date.getDate() <= upperDateRange.getDate() &&
    date.getMonth() <= upperDateRange.getMonth() &&
    date.getFullYear() <= upperDateRange.getFullYear()
  ) {
    return true;
  }
  return false;
};

export const getWeeklyStartDate = (start_date: Date, interval: number) => {
  // the start_date is setting the starting week regardless if the starting date is in a different month
  const delta = interval - start_date.getDay();

  if (delta !== 0) {
    return addDays(start_date, delta);
  }
  return start_date;
};

export const getMonthlyStartDate = (start_date: Date, interval: number) => {
  //When monthly intervals are created, the user is asked to choose the starting month. So we need to set the starting date to the same month as the start_date but with the interval as the date.
  const startDay = start_date.getDate();
  const daysInCurrentMonth = getDaysInMonth(start_date);
  if (startDay !== interval) {
    if (interval > daysInCurrentMonth) {
      return set(start_date, { date: daysInCurrentMonth });
    }
    return set(start_date, { date: interval });
  }
  return start_date;
};

export const getMonthlyInterval = (month: Date, interval: number) => {
  // date-fns setting date does not play nice with feb in leap years
  if (isLeapYear(month) && month.getMonth() === 1 && interval > 29) {
    return set(month, { date: 29 });
  }

  return set(month, { date: interval });
};
export const getAnnuallyStartDate = (start_date: Date, interval: number) => {
  const dayOfYear = getDayOfYear(start_date);
  if (dayOfYear !== interval) {
    if (isLeapYear(start_date) && interval > 59) {
      //leap years have a February 29th which is the 60th day of the year
      // if interval is after, then add 1
      return setDayOfYear(start_date, interval + 1);
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
