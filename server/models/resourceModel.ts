import { Schema, model } from "mongoose";
import type { IResource } from "../types";

const ResourceSchema = new Schema<IResource>(
  {
    name: { type: String, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

const Resource = model<IResource>("Resource", ResourceSchema);
export default Resource;
