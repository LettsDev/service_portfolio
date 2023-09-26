import bcryptjs from "bcryptjs";
import { Schema, model } from "mongoose";
import type { IUser } from "../types";
import "dotenv/config";

const UserSchema = new Schema<IUser>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    auth: { type: String, required: true, enum: ["ADMIN", "ENHANCED", "USER"] },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  let user = this;
  if (!user.isModified("password")) {
    return next();
  }
  const saltRounds = 8;
  if (saltRounds) {
    const salt = await bcryptjs.genSalt(saltRounds);
    const hash = await bcryptjs.hash(user.password, salt);
    user.password = hash;
    return next();
  }
});

UserSchema.methods.validatePassword = async function (
  validationPassword: string
): Promise<boolean> {
  const user = this as IUser;
  return bcryptjs
    .compare(validationPassword, user.password)
    .catch((e) => false);
};

const User = model<IUser>("User", UserSchema);
export default User;
