import { Schema, model } from "mongoose";
import type { ILocation } from "../types";
import Resource from "./resourceModel";

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

LocationSchema.pre("findOneAndDelete", async function (next) {
  console.log(this.getFilter());
  const filter = this.getFilter();
  const resources = await Resource.find({ location: filter });
  resources.forEach(async (resource) => {
    await resource.deleteOne();
  });
  next();
});

const Location = model<ILocation>("Location", LocationSchema);

export default Location;
