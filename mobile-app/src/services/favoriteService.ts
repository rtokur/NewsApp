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
  cursor?: string
): Promise<FavoritesResponse> {
  const params: any = { limit };
  if (cursor) {
    params.cursor = cursor;
  }

  const response = await api.get("v1/favorites", {
    params,
  });
  console.log("FetchFavorites response data:", response.data);
  return response.data;
}
