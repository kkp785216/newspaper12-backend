import type { ArticleRequestBody } from "./types";

type GetAllArticlesRequestBody = {
  limit?: number;
  page?: number;
  sort?: "asc" | "desc";
};
type GetAllArticlesForAdminRequestBody = {
  limit?: number;
  page?: number;
  sort?: "asc" | "desc";
  status?: string;
};

type GetArticlesByCategoryRequestBody = GetAllArticlesRequestBody;
type GetArticlesByCategoryRequestBodyForAdmin = GetAllArticlesRequestBody & {
  status?: string;
};

type GetArticlesByTagRequestBody = GetAllArticlesRequestBody;
type GetArticlesByTagRequestBodyForAdmin = GetAllArticlesRequestBody & {
  status?: string;
};

export type {
  GetAllArticlesRequestBody,
  GetAllArticlesForAdminRequestBody,
  GetArticlesByCategoryRequestBody,
  GetArticlesByCategoryRequestBodyForAdmin,
  GetArticlesByTagRequestBody,
  GetArticlesByTagRequestBodyForAdmin,
};
