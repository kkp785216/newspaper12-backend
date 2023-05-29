import mongoose from "mongoose";
const matchLookupFunc = (tagId: string) => {
  const matchLookup = [
    {
      $match: {
        tags: {
          $in: [new mongoose.Types.ObjectId(tagId)],
        },
      },
    },
  ];
  return matchLookup;
};

export { matchLookupFunc };
