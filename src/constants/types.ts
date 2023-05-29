import type { ObjectId } from "mongoose";

type ArticleRequestBody = {
  categories: ObjectId[];
  tags: ObjectId[];
  title: string;
  description: string;
  author: ObjectId;
  status: "published" | "draft";
  views: number;
  url: string;
  imgUrl: null | string;
  content: null | string;
  contentType: ContentType;
  template: number;
  allowComment: boolean;
};

type GetAllArticlesResponse = {
  categories: CategoryRequestBody;
  tags: TagRequestBody;
  author: Omit<UserProfileResponse, "role" | "password">;
} & Omit<ArticleRequestBody, "categories" | "tags" | "author">;

type ContentType = "post" | "video" | "audio" | "news";

type CategoryRequestBody = {
  name: string;
  slug: string;
  description?: string;
};

type TagRequestBody = CategoryRequestBody;

type LoginRequestBody = {
  email: string;
  password: string;
};

type UserProfileRequestBody = Omit<UserProfileResponse, "_id">;

type UserProfileResponse = {
  _id: ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  mobile: string;
  password: string;
  role: "user" | "admin";
};

export type {
  ArticleRequestBody,
  GetAllArticlesResponse,
  ContentType,
  CategoryRequestBody,
  TagRequestBody,
  LoginRequestBody,
  UserProfileResponse,
  UserProfileRequestBody,
};
