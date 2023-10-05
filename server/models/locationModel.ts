import { Schema, model } from "mongoose";
import type { ILocation } from "../types";

const LocationSchema = new Schema<ILocation>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

LocationSchema.virtual("numResources", {
  ref: "Resource",
  localField: "_id",
  foreignField: "location",
  count: true,
});

const Location = model<ILocation>("Location", LocationSchema);

export default Location;
