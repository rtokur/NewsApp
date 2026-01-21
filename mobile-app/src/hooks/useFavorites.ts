import { useCallback, useEffect, useState } from "react";
import { NewsData } from "../types/news";
import { fetchFavorites } from "../services/favoriteService";

export function useFavorites(limit = 10) {
    const [data, setData] = useState<NewsData[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const loadFavorites = useCallback(async () => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);
            setError(null);
            const response = await fetchFavorites(limit, cursor ?? undefined);
            setData((prevData) => [...prevData, ...response.items.map(item => item.news)]);
            setCursor(response.nextCursor);
            setHasMore(!!response.nextCursor);
        } catch (err: any) {
            setError(err.message ?? "Failed to load favorites");
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    }, [cursor, hasMore, limit, loading]);

    const refresh = async () => {
        setData([]);
        setCursor(null);
        setHasMore(true);
        setInitialLoading(true);
    }

    useEffect(() => {
        loadFavorites();
    }, []);

    return {
        data,
        loading,
        initialLoading,
        error,
        hasMore,
        loadMore: loadFavorites,
        refresh,
    };
}