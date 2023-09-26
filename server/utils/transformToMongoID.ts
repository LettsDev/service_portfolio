import mongoose from "mongoose";
const transformToMongoId = (val: string) => {
  const id = new mongoose.Types.ObjectId(val);
  return id;
};
export default transformToMongoId;
