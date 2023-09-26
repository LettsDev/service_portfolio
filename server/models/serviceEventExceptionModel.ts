import { Schema, model } from "mongoose";
import type { IServiceEventException } from "../types";

const ServiceEventExceptionSchema = new Schema<IServiceEventException>({
  service: {
    type: Schema.Types.ObjectId,
    ref: "ServiceSchedule",
    required: true,
  },
  exception_date: { type: Schema.Types.Date, required: true },
  is_cancelled: { type: Schema.Types.Boolean, required: true },
  is_rescheduled: { type: Schema.Types.Boolean, required: true },
  created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  start_date: { type: Schema.Types.Date, required: true },
});

const ServiceEventException = model<IServiceEventException>(
  "ServiceEventException",
  ServiceEventExceptionSchema
);

export default ServiceEventException;
