import mongoose from "mongoose";

const validateMongoDbId = (id: string) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid) throw new Error("This id is not valid or not found");
}

export default validateMongoDbId;