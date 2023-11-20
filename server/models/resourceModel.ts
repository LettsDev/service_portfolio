import { Schema, model } from "mongoose";
import type { IResource } from "../types";
import Service from "./serviceModel";
const ResourceSchema = new Schema<IResource>(
  {
    name: { type: String, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

ResourceSchema.virtual("numServices", {
  ref: "Service",
  localField: "_id",
  foreignField: "resource",
  count: true,
});

ResourceSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const services = await Service.find({ resource: this._id });
    services.forEach(async (service) => await service.deleteOne());
    next();
  }
);

const Resource = model<IResource>("Resource", ResourceSchema);
export default Resource;
