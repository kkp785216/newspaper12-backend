import mongoose, { ObjectId } from "mongoose";

const validateMongoDbId = (id: string | ObjectId) => {
  const isValid = mongoose.Types.ObjectId.isValid(id as string);
  if (!isValid) throw new Error("This id is not valid or not found");
};

export default validateMongoDbId;
