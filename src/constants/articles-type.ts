type GetAllArticlesRequestBody = {
  limit?: number;
  page?: number;
  sort?: "asc" | "desc";
};

type GetArticlesByCategoryRequestBody = GetAllArticlesRequestBody & {
  category: string;
};

type GetArticlesByTagRequestBody = GetAllArticlesRequestBody & {
  tag: string;
};

export type {
  GetAllArticlesRequestBody,
  GetArticlesByCategoryRequestBody,
  GetArticlesByTagRequestBody,
};
