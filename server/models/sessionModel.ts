import { Schema, model } from "mongoose";
import { ISession } from "../types";

const SessionSchema = new Schema<ISession>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    valid: { type: Schema.Types.Boolean, default: true },
    userAgent: { type: Schema.Types.String, required: true },
  },
  { timestamps: true }
);

const Session = model<ISession>("Session", SessionSchema);
export default Session;
