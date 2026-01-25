import { NewsData } from "../types/news";
import api from "./api";

export interface ReadingHistoryItem {
  id: number;
  readAt: string;
  news: NewsData;
}

export interface ReadingHistoryResponse {
  items: ReadingHistoryItem[];
  nextCursor: string | null;
}

export const fetchReadingHistory = async (
  limit = 10,
  cursor?: string,
  options?: {
    categoryId?: number;
    search?: string;
  }
): Promise<ReadingHistoryResponse> => {
    const params: any = { limit };
    if (cursor) params.cursor = cursor;
    if (options?.categoryId && options.categoryId !== 0) {
      params.categoryId = options.categoryId;
    }
    if (options?.search) {
      params.search = options.search;
    }
  const response = await api.get("v1/reading-history", { params });

  return response.data;
};

export async function deleteReadingHistory(newsId: number) {
    return api.delete(`/v1/reading-history/${newsId}`);
  }