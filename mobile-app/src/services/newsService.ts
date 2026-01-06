import { NewsDetail } from "../types/newsDetail";
import api from "./api";
import { News } from "../types/news";

interface FetchNewsParams {
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
  sortOrder?: "ASC" | "DESC";
}

export const fetchNews = async ({page = 1, limit = 10, categoryId, search, sortOrder = 'DESC'} : FetchNewsParams): Promise<News> => {
  try {
    const response = await api.get("/news", { params: { 
      page, 
      limit, 
      categoryId, 
      search,
      sortOrder,
    } });
    console.log("FetchNews response data:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("FetchNews error details:", err.response || err.message);
    throw err;
  }
};

export async function fetchNewsDetail(id: number): Promise<NewsDetail> {
  try {
    const response = await api.get(`/news/${id}`);
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

export const fetchBreakingNewsHighlight = async (): Promise<News> => {
  try {
    const response = await api.get("/news/breaking/highlight");
    console.log("FetchBreakingNewsHighlight response data:", response.data);
    return response.data.data;
  } catch (err: any) {
    console.error(
      "FetchBreakingNewsHighlight error details:",
      err.response || err.message
    );
    throw err;
  }
}

export const fetchBreakingNews = async (): Promise<News> => {
  try {
    const response = await api.get("/news/breaking");
    console.log("FetchBreakingNews response data:", response.data);
    return response.data.data;
  } catch (err: any) {
    console.error(
      "FetchBreakingNews error details:",
      err.response || err.message
    );
    throw err;
  }
};

export const fetchRecommendedNews = async (): Promise<News> => {
  try {
    const response = await api.get("/news/recommendations");
    console.log("FetchRecommendationNews response data:", response.data);
    return response.data.data;
  } catch (err: any) {
    console.error(
      "FetchRecommendationNews error details:",
      err.response || err.message
    );
    throw err;
  }
};
