import { Schema, model } from "mongoose";
import type { IEquipment } from "../types";

const EquipmentSchema = new Schema<IEquipment>(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const Equipment = model<IEquipment>("Equipment", EquipmentSchema);
export default Equipment;
