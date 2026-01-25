import { useCallback, useRef } from "react";
import api from "@/src/services/api";

export function useMarkNewsAsRead() {
  const sentIdsRef = useRef<Set<number>>(new Set());

  const markAsRead = useCallback(async (newsId: number) => {
    if (!newsId) return;

    if (sentIdsRef.current.has(newsId)) return;

    sentIdsRef.current.add(newsId);

    try {
      await api.post("v1/reading-history", {
        newsId,
      });
    } catch (err) {
      console.warn("markAsRead failed", err);

      sentIdsRef.current.delete(newsId);
    }
  }, []);

  return { markAsRead };
}
