import * as z from "zod";
import { isSameDay, isBefore } from "date-fns";
// If type = 'Once' then value = 0 (no interval) schedule would execute on start_date
// If type = 'Daily' then value = # of days interval
// If type = 'Weekly' then 1 through 7 for day of the week
// If type = 'Monthly' then 1 through 31 for day of the month
// If type = 'Annually' then 1 through 365 for day of the year
export const serviceSchema = z
  .object({
    name: z.string(),
    resource: z.string(),
    start_date: z.date(),
    completion_date: z.date(),
    interval: z.number(),
    frequency: z.string(),
  })
  .partial() // makes all the fields optional, which is required for superRefine to run
  .superRefine(
    (
      { name, frequency, interval, resource, start_date, completion_date },
      ctx
    ) => {
      if (name === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "a name is required",
          path: ["name"],
        });
      }
      if (resource === "placeholder") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "a resource is required",
          path: ["resource"],
        });
      }
      if (frequency === "placeholder") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "a frequency is required",
          path: ["frequency"],
        });
      }

      if (interval === 0 && frequency !== "ONCE") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "an interval is required",
          path: ["interval"],
        });
      }
      if (frequency !== "ONCE") {
        if (start_date && completion_date) {
          if (isSameDay(start_date, completion_date)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "the start and end dates cannot be on the same day",
              path: ["start_date"],
            });
          }
          if (typeof interval === "number") {
            if (interval === 0 && frequency !== "ONCE") {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "an interval is required",
                path: ["interval"],
              });
            }

            if (frequency === "WEEKLY" && (interval < 1 || interval > 7)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "an interval of 1 to 7 is required",
                path: ["interval"],
              });
            }
            if (frequency === "MONTHLY" && (interval < 1 || interval > 31)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "an interval of 1 to 31 is required",
                path: ["interval"],
              });
            }
            if (frequency === "ANNUALLY" && (interval < 1 || interval > 365)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "an interval of 1 to 365 is required",
                path: ["interval"],
              });
            }
          }
          if (isBefore(completion_date, start_date)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "the end date cannot be before the start date",
              path: ["end_date"],
            });
          }
        }
      }
    }
  );
export type ValidationSchema = z.infer<typeof serviceSchema>;

export const helperInfo = (watchFrequency: string | undefined) => {
  switch (watchFrequency) {
    case "ONCE":
      return "once: no interval (service only runs once)";
    case "DAILY":
      return "daily: interval is the # of days between events";
    case "WEEKLY":
      return "weekly: interval is the day of the week, use 1 to 7 (Sunday start)";
    case "MONTHLY":
      return "monthly: interval is the day of the month, use 1 to 31 ";
    case "ANNUALLY":
      return "annually: interval is the day of the year, use 1 to 365";
    default:
      return " ";
  }
};
