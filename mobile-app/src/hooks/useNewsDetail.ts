import { useState, useEffect, useCallback } from "react";
import { NewsDetail} from "../types/newsDetail";
import { fetchNewsDetail } from "../services/newsService";

export function useNewsDetail(id: number) {
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    const loadDetail = useCallback(async () => {
      if(!id) {
        setError("Invalid news ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchNewsDetail(id);
        setNews(data);
        setError(null);
      } catch (e) {
          setError("Failed to load news detail");
          setNews(null);
      } finally {
          setLoading(false);
      }
    }, [id]);

    useEffect(() => {
      loadDetail();
    }, [loadDetail]);

    const refetch = useCallback(() => {
      loadDetail();
    }, [loadDetail]);

    return { news, loading, error, refetch };
}