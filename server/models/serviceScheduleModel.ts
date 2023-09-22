import { Schema, model } from "mongoose";
import type { IServiceSchedule } from "../types";

const ServiceScheduleSchema = new Schema<IServiceSchedule>({
  type: { type: Schema.Types.ObjectId, ref: "Service", required: true },
  created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  start_date: { type: Date, required: true },
  cost: Number,
  equipment: {
    type: Schema.Types.ObjectId,
    ref: "EquipmentInstance",
    required: true,
  },
  notes: String,
  status: {
    type: String,
    enum: ["COMPLETE", "IN_PROGRESS", "NOT_STARTED"],
    required: true,
  },
  completion_date: { type: Date, required: true },
});

const ServiceSchedule = model<IServiceSchedule>(
  "ServiceSchedule",
  ServiceScheduleSchema
);
export default ServiceSchedule;

//if there is no end date then the completion date will be DEC 15, 2099
