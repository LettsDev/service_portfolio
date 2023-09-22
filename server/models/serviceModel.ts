import { Schema, model } from "mongoose";
import type { IService } from "../types";

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["MAINTAIN", "REPAIR", "OTHER"],
    },
    frequency: {
      type: String,
      enum: ["ONCE", "DAILY", "WEEKLY", "MONTHLY", "ANNUALLY"],
    },
    interval: Number,
  },

  { timestamps: true }
);

const Service = model<IService>("Service", ServiceSchema);
export default Service;
// Frequencytype would be one of the following values

// 'O' = Once
// 'D' = Daily
// 'W' = Weekly
// 'M' = Monthly
// 'A' = Annually
// Frequencyinterval would be numeric and the meaning of the value depends on the value of frequencytype

// If type = 'Once' then value = 0 (no interval) schedule would execute on startdate
// If type = 'Daily' then value = # of days interval
// If type = 'Weekly' then 1 through 7 for day of the week
// If type = 'Monthly' then 1 through 31 for day of the month
// If type = 'Annually' then 1 through 365 for day of the year
