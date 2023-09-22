import { Schema, model } from "mongoose";
import type { ILocation } from "../types";

const LocationSchema = new Schema<ILocation>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Location = model<ILocation>("Location", LocationSchema);

export default Location;
