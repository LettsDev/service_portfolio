import { addDays } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

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

export function convertFromIsoStringToDate(isoString: string) {
  return new Date(utcToZonedTime(isoString, timeZone));
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
