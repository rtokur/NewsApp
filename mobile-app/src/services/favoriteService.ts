import api from "./api";
import { NewsData } from "../types/news";

export interface FavoritesResponse {
  items: {
    id: number;
    news: NewsData;
    createdAt: string;
  }[];
  nextCursor: string | null;
}

export async function fetchFavorites(
  limit = 10,
  cursor?: string,
  options?: {
    categoryId?: number;
    search?: string;
    sortOrder?: "ASC" | "DESC";
  }
): Promise<FavoritesResponse> {
  const params: any = {
    limit,
    sortOrder: options?.sortOrder,
  };

  if (cursor) params.cursor = cursor;
  if (options?.categoryId && options.categoryId !== 0) {
    params.categoryId = options.categoryId;
  }
  if (options?.search) {
    params.search = options.search;
  }

  const response = await api.get("v1/favorites", { params });
  return response.data;
}

