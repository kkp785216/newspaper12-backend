import mongoose from "mongoose";
const matchLookupFunc = (categoryId: string) => {
  const matchLookup = [
    {
      $match: {
        categories: {
          $in: [new mongoose.Types.ObjectId(categoryId)],
        },
      },
    },
  ];
  return matchLookup;
};

export { matchLookupFunc };
