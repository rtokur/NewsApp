import api from './api';

export const fetchNews = async (page = 1, limit = 10) => {
    try {
      const response = await api.get("/news", { params: { page, limit } });
      console.log("FetchNews response data:", response.data.data);
      return response.data.data;
    } catch (err: any) {
      console.error("FetchNews error details:", err.response || err.message);
      throw err;
    }
  };  

export async function fetchNewsDetail(id: number) {
    try {
        const response = await api.get(`/news/${id}`);
        console.log("FetchNewsDetail response data:", response.data);
        return response.data;
    } catch (err: any) {
      console.error("FetchNewsDetail error details:", err.response || err.message);
      throw err;
    }
    
}