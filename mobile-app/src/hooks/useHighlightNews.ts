import { useState, useEffect, useCallback } from "react";
import { fetchNewsByType } from "../services/newsService";
import { NewsData, HighlightResponse } from "../types/news";

export function useHighlightNews(type: "breaking-highlight" | "recommendations-highlight") {
  const [data, setData] = useState<NewsData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    const loadHighlightNews = useCallback(async () => {
      try {
        setLoading(true);
        const result = await fetchNewsByType<HighlightResponse>({ type });
        setData(result.data);
        setError(null);
      } catch (err) {
        setError("Failed to load news");
      } finally {
        setLoading(false);
      }
    }, [type]);

    useEffect(() => {
      loadHighlightNews();
    }, [loadHighlightNews]);
  
    const refetch = useCallback(() => {
      loadHighlightNews();
    }, [loadHighlightNews]);
  
    return { data, loading, error, refetch };
}