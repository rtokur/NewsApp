
import { fetchNewsByType, FetchNewsParams } from "../services/newsService";
import { PaginatedResponse, NewsData } from "../types/news";

export const useBreakingNews = (params: FetchNewsParams) =>
  fetchNewsByType<PaginatedResponse<NewsData>>({
    ...params,
    type: "breaking",
  });