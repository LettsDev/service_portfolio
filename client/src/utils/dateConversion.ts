import { IService, IServiceDated } from "../types";

export function convertFromDateToIsoString(date: Date) {
  return date.toISOString();
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

export function fromDatePickerToDate(dateString: string) {
  //dateString format yyyy-mm-dd
  const [year, month, day] = dateString.split("-");
  return new Date(+year, +month - 1, +day, 12);
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
