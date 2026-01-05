import { useState, useEffect } from "react";
import { NewsDetail} from "../types/newsDetail";
import { fetchNewsDetail } from "../services/newsService";

export function useNewsDetail(id: number) {
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDetail = async () => {
      try {
        const data = await fetchNewsDetail(id);
        if (isMounted) {
          setNews(data);
        }
      } catch (e) {
        if (isMounted) {
          setError("Failed to load news detail");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

    return { news, loading, error };
}