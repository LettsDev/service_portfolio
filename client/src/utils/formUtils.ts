import { IServiceSubmit } from "../types";
import { convertFromDateToIsoString } from "./dateConversion";

type frequencyIntervalSwitcherProps = {
  frequency: IServiceSubmit["frequency"];
  intervals: {
    dailyInterval: string;
    weeklyInterval: string;
    monthlyInterval: string;
    annualInterval: string;
  };
  startDates: {
    startDate: string;
    weeklyStartDate: string;
    monthlyStartDate: string;
    annualStartDate: string;
  };
  completionDates: {
    completionDate: string;
    weeklyCompletionDate: string;
    monthlyCompletionDate: string;
    annualCompletionDate: string;
  };
};
export function frequencyIntervalSwitcher({
  frequency,
  intervals,
  startDates,
  completionDates,
}: frequencyIntervalSwitcherProps) {
  switch (frequency) {
    case "ONCE":
      return {
        interval: +intervals.dailyInterval,
        formattedStartDate: new Date(startDates.startDate).toISOString(),
        formattedCompletionDate: new Date(startDates.startDate).toISOString(),
      };
    case "DAILY":
      return {
        interval: +intervals.dailyInterval,
        formattedStartDate: convertFromDateToIsoString(
          new Date(startDates.startDate)
        ),
        formattedCompletionDate: convertFromDateToIsoString(
          new Date(completionDates.completionDate)
        ),
      };
    case "WEEKLY": {
      return {
        interval: +intervals.weeklyInterval,
        formattedStartDate: new Date(startDates.weeklyStartDate).toISOString(),
        formattedCompletionDate: new Date(
          completionDates.weeklyCompletionDate
        ).toISOString(),
      };
    }
    case "MONTHLY":
      return {
        interval: +intervals.monthlyInterval,
        formattedStartDate: new Date(startDates.monthlyStartDate).toISOString(),
        formattedCompletionDate: new Date(
          completionDates.monthlyCompletionDate
        ).toISOString(),
      };
    case "ANNUALLY":
      return {
        //TODO convert to day of the year
        interval: +intervals.annualInterval,
        formattedStartDate: convertFromDateToIsoString(
          new Date(startDates.annualStartDate)
        ),
        formattedCompletionDate: convertFromDateToIsoString(
          new Date(completionDates.annualCompletionDate)
        ),
      };
  }
}

export function formatDateWithLocalTime(startDate: string) {
  const [year, month, day] = startDate!.split("-");
  const startTime = new Date();
  startTime.setFullYear(+year);
  startTime.setMonth(+month - 1);
  startTime.setDate(+day);
  return startTime;
}
