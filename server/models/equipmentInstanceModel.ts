import { Schema, model } from "mongoose";
import type { IEquipmentInstance } from "../types";

const EquipmentInstanceSchema = new Schema<IEquipmentInstance>(
  {
    type: { type: Schema.Types.ObjectId, ref: "Equipment", required: true },
    location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    notes: String,
    serial_number: String,
    model_number: String,
    status: {
      type: String,
      required: true,
      enum: [
        "OPERABLE",
        "INOPERABLE",
        "DAMAGED",
        "OUT_OF_SERVICE",
        "BEING_REPAIRED",
      ],
    },
  },
  { timestamps: true }
);

const EquipmentInstance = model<IEquipmentInstance>(
  "EquipmentInstance",
  EquipmentInstanceSchema
);
export default EquipmentInstance;
