import * as z from "zod";
import {
  // isSameDay,
  isBefore,
  addDays,
  isSameWeek,
  isSameMonth,
  setDay,
  set,
  getDayOfYear,
  setDayOfYear,
} from "date-fns";
import { formatDateWithLocalTime } from "../utils/formUtils";
import { IService } from "../types";
import { getWeeklyStartDate } from "../utils/calendarUtils";

export const serviceSchema = z
  .object({
    name: z.string(),
    resource: z.string(),
    startDate: z.string(),
    weeklyStartDate: z.string(),
    monthlyStartDate: z.string(),
    annualStartDate: z.string(),
    completionDate: z.string(),
    weeklyCompletionDate: z.string(),
    monthlyCompletionDate: z.string(),
    annualCompletionDate: z.string(),
    frequency: z.string(),
    dailyInterval: z.string(),
    weeklyInterval: z.string(),
    monthlyInterval: z.string(),
    annualInterval: z.string(),
  })
  .partial() // makes all the fields optional, which is required for superRefine to run
  .superRefine(
    (
      {
        name,
        resource,
        startDate,
        weeklyStartDate,
        monthlyStartDate,
        annualStartDate,
        completionDate,
        weeklyCompletionDate,
        monthlyCompletionDate,
        annualCompletionDate,
        frequency,
        dailyInterval,
        weeklyInterval,
        monthlyInterval,
        annualInterval,
      },
      ctx
    ) => {
      // ********************** NAME **********************

      if (name === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "a name is required",
          path: ["name"],
        });
      }
      // ********************** RESOURCE **********************
      if (resource === "placeholder") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "a resource is required",
          path: ["resource"],
        });
      }
      // ********************** FREQUENCY **********************
      if (frequency === "placeholder") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "a frequency is required",
          path: ["frequency"],
        });
      }

      // ONCE => no interval
      // DAILY => interval (default value = 0)
      // WEEKLY => interval (default value = 0)
      // MONTHLY => interval (default value = 0)
      // ANNUALLY =>annualInterval (default value = current Date)

      // ********************** frequency === ONCE **********************

      if (frequency === "ONCE" || frequency === "DAILY") {
        if (!startDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "a starting date is required",
            path: ["startDate"],
          });
        }
        //removed due to editing past events
        // const startTime = formatDateWithLocalTime(startDate!);
        // const now = new Date();
        // if (!isBefore(now, startTime) && !isSameDay(now, startTime)) {
        //   ctx.addIssue({
        //     code: z.ZodIssueCode.custom,
        //     message: `the date has to be at least: ${new Date().toLocaleDateString()}`,
        //     path: ["startDate"],
        //   });
        // }
      }

      if (frequency === "DAILY") {
        if (!dailyInterval || +dailyInterval === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "an interval is required",
            path: ["dailyInterval"],
          });
        }
        if (+dailyInterval! < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "an interval has to be more than 0",
            path: ["dailyInterval"],
          });
        }
        if (!completionDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "a completion date is required",
            path: ["completionDate"],
          });
        }
        const completionTime = formatDateWithLocalTime(completionDate!);
        const leastFuture = addDays(
          formatDateWithLocalTime(startDate!),
          +dailyInterval! + 1
        );
        if (completionTime! < leastFuture) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `the date has to be at least: ${leastFuture.toLocaleDateString()}`,
            path: ["completionDate"],
          });
        }
      }
      if (frequency === "WEEKLY") {
        if (weeklyInterval === "7") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "an interval is required",
            path: ["weeklyInterval"],
          });
        }

        if (!weeklyStartDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "a start date is required",
            path: ["weeklyStartDate"],
          });
        }
        if (!weeklyCompletionDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "a completion date is required",
            path: ["weeklyCompletionDate"],
          });
        }
        if (
          !isBefore(new Date(weeklyStartDate!), new Date(weeklyCompletionDate!))
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "the completion date must come after the start date",
            path: ["weeklyCompletionDate"],
          });
        }

        if (
          isSameWeek(
            new Date(weeklyStartDate!),
            new Date(weeklyCompletionDate!)
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "the completion date and start date can't fall on the same week",
            path: ["weeklyStartDate"],
          });
        }
      }
      if (frequency === "MONTHLY") {
        if (!monthlyInterval || +monthlyInterval === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "an interval is required",
            path: ["monthlyInterval"],
          });
        }
        if (+monthlyInterval! < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "an interval has to be more than 0",
            path: ["monthlyInterval"],
          });
        }
        if (+monthlyInterval! > 31) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "an interval has to be at most 31",
            path: ["monthlyInterval"],
          });
        }
        if (!monthlyStartDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "a start date is required",
            path: ["monthlyStartDate"],
          });
        }
        if (!monthlyCompletionDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "a completion date is required",
            path: ["monthlyCompletionDate"],
          });
        }
        if (
          !isBefore(
            new Date(monthlyStartDate!),
            new Date(monthlyCompletionDate!)
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "the completion date must come after the start date",
            path: ["monthlyCompletionDate"],
          });
        }

        if (
          isSameMonth(
            new Date(monthlyStartDate!),
            new Date(monthlyCompletionDate!)
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "the completion date and start date can't fall on the same month",
            path: ["monthlyStartDate"],
          });
        }
      }
      if (frequency === "ANNUALLY") {
        if (!annualInterval) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "an interval is required",
            path: ["annualInterval"],
          });
        }

        if (!annualStartDate || +annualStartDate === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "a start year is required",
            path: ["annualStartDate"],
          });
        }
        //removed due to editing an older service
        // if (+annualStartDate! < new Date().getFullYear()) {
        //   ctx.addIssue({
        //     code: z.ZodIssueCode.custom,
        //     message: `the start year must be at least ${new Date().getFullYear()}`,
        //     path: ["annualStartDate"],
        //   });
        // }

        if (!annualCompletionDate || +annualCompletionDate === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "a completion year is required",
            path: ["annualCompletionDate"],
          });
        }
        // if (+annualCompletionDate! < new Date().getFullYear() + 1) {
        //   ctx.addIssue({
        //     code: z.ZodIssueCode.custom,
        //     message: `the start year must be at least ${
        //       new Date().getFullYear() + 1
        //     }`,
        //     path: ["annualCompletionDate"],
        //   });
        // }
        if (+annualCompletionDate! < +annualStartDate!) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "the start year must be more than the completion year ",
            path: ["annualStartDate"],
          });
        }
      }
    }
  )
  .transform(
    ({
      name,
      resource,
      startDate,
      weeklyStartDate,
      monthlyStartDate,
      annualStartDate,
      completionDate,
      weeklyCompletionDate,
      monthlyCompletionDate,
      annualCompletionDate,
      frequency,
      dailyInterval,
      weeklyInterval,
      monthlyInterval,
      annualInterval,
    }) => {
      // ****************** Interval ******************
      // If type = 'Once' then value = 0 (no interval) schedule would execute on start_date
      // If type = 'Daily' then value = # of days interval
      // If type = 'Weekly' then 1 through 7 for day of the week
      // If type = 'Monthly' then 1 through 31 for day of the month
      // If type = 'Annually' then 1 through 365 for day of the year

      const trueWeeklyStartDate = getWeeklyStartDate(
        new Date(weeklyStartDate!),
        +weeklyInterval!
      ).toISOString();
      const trueWeeklyCompletionDate = getWeeklyStartDate(
        new Date(weeklyCompletionDate!),
        +weeklyInterval!
      ).toISOString();

      //Monthly -> the starting and completion dates occur on the interval (day of the month)
      //if interval is beyond the scope of the month chosen -> will move to end of month when calculating i.e interval of 31 in November when it only has 30 days

      const trueMonthlyStartDate =
        +monthlyInterval! < new Date(monthlyStartDate!).getDate()
          ? set(new Date(monthlyStartDate!), {
              date: +monthlyInterval!,
            }).toString()
          : monthlyStartDate!;
      const trueMonthlyCompletionDate =
        +monthlyInterval! < new Date(monthlyCompletionDate!).getDate()
          ? set(new Date(monthlyCompletionDate!), {
              date: +monthlyInterval!,
            }).toString()
          : monthlyCompletionDate!;
      //Annually -> need to create start date, completion date and interval
      const trueAnnualInterval = getDayOfYear(new Date(annualInterval!)) + 1;
      const trueAnnualStartDate = setDayOfYear(
        new Date(+annualStartDate!, 0, 1),
        trueAnnualInterval
      ).toString();
      const trueAnnualCompletionDate = setDayOfYear(
        new Date(+annualCompletionDate!, 0, 1),
        trueAnnualInterval
      ).toString();
      return {
        name,
        resource,
        startDate,
        weeklyStartDate: trueWeeklyStartDate,
        monthlyStartDate: trueMonthlyStartDate,
        annualStartDate: trueAnnualStartDate,
        completionDate,
        weeklyCompletionDate: trueWeeklyCompletionDate,
        monthlyCompletionDate: trueMonthlyCompletionDate,
        annualCompletionDate: trueAnnualCompletionDate,
        frequency,
        dailyInterval,
        weeklyInterval,
        monthlyInterval,
        annualInterval: trueAnnualInterval.toString(),
      };
    }
  );

export type ValidationSchema = z.infer<typeof serviceSchema>;

export const helperInfo = (
  watchFrequency: string | undefined,
  loaderDataService?: IService
) => {
  switch (watchFrequency || loaderDataService?.frequency) {
    case "DAILY":
      return "every (interval) days";
    case "WEEKLY":
      return "interval is the day of the week, every week";
    case "MONTHLY":
      return "interval is the day of the month, use 1 to 31 ";
    case "ANNUALLY":
      return "interval is the day of the year";
    default:
      return " ";
  }
};
