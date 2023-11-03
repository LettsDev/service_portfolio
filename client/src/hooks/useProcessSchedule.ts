import type { IUser, IService } from "../types";
import {
  add,
  getDay,
  getDate,
  set,
  isBefore,
  getDayOfYear,
  setDayOfYear,
  nextDay,
  Day,
  parseISO,
} from "date-fns";

export default function useProcessSchedule() {
  // filter functions
  const endBefore = (
    serviceSchedule: IService,
    lowerDateRange: Date
  ): boolean => {
    return isBefore(parseISO(serviceSchedule.completion_date), lowerDateRange);
  };

  const startAfter = (
    serviceSchedule: IService,
    upperDateRange: Date
  ): boolean => {
    return isBefore(upperDateRange, parseISO(serviceSchedule.start_date));
  };

  const withinRange = (
    date: Date,
    lowerDateRange: Date,
    upperDateRange: Date
  ): boolean => {
    //if within the lower and upper date ranges
    if (date >= lowerDateRange && date <= upperDateRange) {
      return true;
    }
    return false;
  };

  function Daily(
    start_date: Date,
    completion_date: Date,
    interval: number,
    schedule: IService,
    lowerDateRange: Date,
    upperDateRange: Date,
    created_by: IUser
  ): ICreatedServiceEventException[] {
    const events: ICreatedServiceEventException[] = [];
    for (
      let day = start_date;
      day <= completion_date;
      day = add(day, { days: interval })
    ) {
      if (withinRange(day, lowerDateRange, upperDateRange)) {
        events.push({
          _id: crypto.randomUUID(),
          service: schedule,
          exception_date: day.toISOString(),
          is_cancelled: false,
          is_rescheduled: false,
          start_date: day.toISOString(),
          created_by,
        });
      }
    }
    return events;
  }

  function Weekly(
    start_date: Date,
    completion_date: Date,
    interval: number,
    schedule: IService,
    lowerDateRange: Date,
    upperDateRange: Date,
    created_by: IUser
  ): ICreatedServiceEventException[] {
    const events: ICreatedServiceEventException[] = [];
    //if your day of the week interval is before the starting date day of the week: start the next week on the interval
    //example start date is set for a Friday, but the interval is every Tuesday, the first event would be on the following Tuesday
    let realStart = new Date();
    if (getDay(start_date) != interval) {
      realStart = nextDay(start_date, interval as Day);
    } else {
      realStart = start_date;
    }
    for (
      let day = realStart;
      day <= completion_date;
      day = add(day, { weeks: 1 })
    ) {
      if (withinRange(day, lowerDateRange, upperDateRange)) {
        events.push({
          _id: crypto.randomUUID(),
          service: schedule,
          exception_date: day.toISOString(),
          is_cancelled: false,
          is_rescheduled: false,
          created_by,
          start_date: day.toISOString(),
        });
      }
    }
    return events;
  }

  function Monthly(
    start_date: Date,
    completion_date: Date,
    interval: number,
    schedule: IService,
    lowerDateRange: Date,
    upperDateRange: Date,
    created_by: IUser
  ): ICreatedServiceEventException[] {
    const events: ICreatedServiceEventException[] = [];
    let realStart = set(start_date, { date: interval });
    if (getDate(start_date) > interval) {
      realStart = set(add(start_date, { months: 1 }), { date: interval });
    }
    for (
      let day = realStart;
      day <= completion_date;
      day = add(day, { months: 1 })
    ) {
      if (withinRange(day, lowerDateRange, upperDateRange)) {
        events.push({
          _id: crypto.randomUUID(),
          service: schedule,
          exception_date: day.toISOString(),
          is_cancelled: false,
          is_rescheduled: false,
          created_by,
          start_date: day.toISOString(),
        });
      }
    }

    return events;
  }

  function Annually(
    start_date: Date,
    completion_date: Date,
    interval: number,
    schedule: IService,
    lowerDateRange: Date,
    upperDateRange: Date,
    created_by: IUser
  ): ICreatedServiceEventException[] {
    const events: ICreatedServiceEventException[] = [];
    let realStart = setDayOfYear(start_date, interval);
    if (getDayOfYear(start_date) > interval) {
      realStart = setDayOfYear(add(start_date, { years: 1 }), interval);
    }

    for (
      let day = realStart;
      day <= completion_date;
      day = add(day, { years: 1 })
    ) {
      if (withinRange(day, lowerDateRange, upperDateRange)) {
        events.push({
          _id: crypto.randomUUID(),
          service: schedule,
          exception_date: day.toISOString(),
          is_cancelled: false,
          is_rescheduled: false,
          created_by,
          start_date: day.toISOString(),
        });
      }
    }
    return events;
  }

  const createEvents = (
    schedule: IService,
    lowerDateRange: Date,
    upperDateRange: Date
  ): ICreatedServiceEventException[] => {
    const { created_by, frequency, interval, start_date, completion_date } =
      schedule;

    switch (frequency) {
      case "ONCE":
        if (withinRange(parseISO(start_date), lowerDateRange, upperDateRange)) {
          return [
            {
              _id: crypto.randomUUID(),
              service: schedule,
              exception_date: start_date,
              is_cancelled: false,
              is_rescheduled: false,
              created_by,
              start_date: start_date,
            },
          ];
        } else {
          return [];
        }
      case "DAILY":
        return Daily(
          parseISO(start_date),
          parseISO(completion_date),
          interval,
          schedule,
          lowerDateRange,
          upperDateRange,
          created_by
        );
      case "WEEKLY":
        return Weekly(
          parseISO(start_date),
          parseISO(completion_date),
          interval,
          schedule,
          lowerDateRange,
          upperDateRange,
          created_by
        );
      case "MONTHLY":
        return Monthly(
          parseISO(start_date),
          parseISO(completion_date),
          interval,
          schedule,
          lowerDateRange,
          upperDateRange,
          created_by
        );
      case "ANNUALLY":
        return Annually(
          parseISO(start_date),
          parseISO(completion_date),
          interval,
          schedule,
          lowerDateRange,
          upperDateRange,
          created_by
        );
      default:
        return [];
    }
  };

  const createServiceEvents = (
    serviceSchedules: IService[],
    lowerDateRange: Date,
    upperDateRange: Date
  ): ICreatedServiceEventException[] => {
    const events: ICreatedServiceEventException[] = [];
    serviceSchedules.forEach((schedule) => {
      if (
        endBefore(schedule, lowerDateRange) !== true &&
        startAfter(schedule, upperDateRange) !== true
      ) {
        events.push(...createEvents(schedule, lowerDateRange, upperDateRange));
      }
    });
    return events;
  };
  return { createServiceEvents };
}

// create the events if they aren't already in the eventExceptions list
