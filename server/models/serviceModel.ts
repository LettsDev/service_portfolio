import { Schema, model } from "mongoose";
import type { IService } from "../types";
import ServiceEventException from "./serviceEventExceptionModel";

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    resource: { type: Schema.Types.ObjectId, ref: "Resource", required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    frequency: {
      type: String,
      enum: ["ONCE", "DAILY", "WEEKLY", "MONTHLY", "ANNUALLY"],
    },
    interval: { type: Number, required: true },
    start_date: { type: Date, required: true },
    completion_date: { type: Date, required: true },
  },

  { timestamps: true }
);

ServiceSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const serviceEvents = await ServiceEventException.find({
      service: this._id,
    });
    serviceEvents.forEach(
      async (serviceEvent) => await serviceEvent.deleteOne()
    );
    next();
  }
);

const Service = model<IService>("Service", ServiceSchema);
export default Service;

// Frequency type would be one of the following values

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
