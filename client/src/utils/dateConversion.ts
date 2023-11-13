import { zonedTimeToUtc } from "date-fns-tz";
import { IService, IServiceDated } from "../types";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function toUtc(date: Date) {
  return zonedTimeToUtc(date, timeZone);
}
export function getUtcEquivalent(selectedDate: Date) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const date = selectedDate.getDate();
  return new Date(Date.UTC(year, month, date));
}

export function convertFromDateToIsoString(date: Date) {
  return date.toISOString();
  // return zonedTimeToUtc(date, timeZone).toISOString();
}

export function dateToIso(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return new Date(Date.UTC(year, month, day)).toISOString();
}
export function IsoToDate(isoString: string) {
  const [year, month, rest] = isoString.split("-");
  const day = rest.slice(0, 2);
  return new Date(+year, +month - 1, +day, 12);
}

export function toIServiceDated(service: IService): IServiceDated {
  return {
    ...service,
    start_date: IsoToDate(service.start_date),
    completion_date: IsoToDate(service.completion_date),
  };
}

export function toIService(datedService: IServiceDated): IService {
  return {
    ...datedService,
    start_date: dateToIso(datedService.start_date),
    completion_date: dateToIso(datedService.completion_date),
  };
}
export function formDateStringToIso(formDateString: string) {
  //formDateString -> "yyyy-mm-dd"
}

export function daysIntoYear(date: Date) {
  // the day of the year (interval)
  const days =
    (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
      Date.UTC(date.getUTCFullYear(), 0, 0)) /
    24 /
    60 /
    60 /
    1000;
  return days;
}

export function dateIntoDays(numberOfDaysInterval: number, year: number) {
  const date = new Date(Date.UTC(year, 0, 1));
  date.setUTCDate(numberOfDaysInterval);
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export function weekFormatting(date: Date) {
  const yearStart = +new Date(date.getFullYear(), 0, 1);
  const dayOfYear = (+date - yearStart + 1) / 86400000;
  return Math.ceil(dayOfYear / 7);
}
