type GetAllArticlesRequestBody = {
  limit?: number;
  page?: number;
  sort?: "asc" | "desc";
};

type GetArticlesByCategoryRequestBody = GetAllArticlesRequestBody & {
  category: string;
};

export type { GetAllArticlesRequestBody, GetArticlesByCategoryRequestBody };
