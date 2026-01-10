import api from "./api";
import { NewsData, NewsType, PaginatedResponse } from "../types/news";
import { NewsDetail } from "../types/newsDetail";

export interface FetchNewsParams {
  type?: NewsType;
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
  sortOrder?: "ASC" | "DESC";
}

export async function fetchNewsByType<T>({
  type = "all",
  page = 1,
  limit,
  categoryId,
  search,
  sortOrder = "DESC",
}: FetchNewsParams): Promise<T> {
  const endpointMap: Record<NewsType, string> = {
    all: "v1/news",
    breaking: "v1/news/breaking",
    recommendations: "v1/news/recommendations",
    "breaking-highlight": "v1/news/breaking/highlight",
    "recommendations-highlight": "v1/news/recommendations/highlight",
  };

  const response = await api.get(endpointMap[type], {
    params: {
      page,
      limit,
      categoryId,
      search,
      sortOrder,
    },
  });

  return response.data;
}

export async function fetchNewsDetail(id: number): Promise<NewsDetail> {
  try {
    const response = await api.get(`v1/news/${id}`);
    console.log("FetchNewsDetail response data:", response.data);
    return response.data;
  } catch (err: any) {
    console.error(
      "FetchNewsDetail error details:",
      err.response || err.message
    );
    throw err;
  }
}
