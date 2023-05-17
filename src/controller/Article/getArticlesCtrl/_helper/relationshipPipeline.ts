const lookupPipeline = [
  {
    $lookup: {
      from: "categories",
      localField: "categories",
      foreignField: "_id",
      as: "categories",
    },
  },
  {
    $lookup: {
      from: "tags",
      localField: "tags",
      foreignField: "_id",
      as: "tags",
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "author",
      foreignField: "_id",
      as: "author",
    },
  },
  {
    $addFields: {
      author: { $arrayElemAt: ["$author", 0] },
    },
  },
  {
    $project: {
      "author.password": 0,
      "author.role": 0,
    },
  },
];

export { lookupPipeline };
