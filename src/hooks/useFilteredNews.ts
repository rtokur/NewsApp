import { useMemo } from "react";
import { newsList } from "../data/newsList";
export type CategoryName = "All" | "Politics" | "Sports" | "Technology" | "Economy" | "Health" | "Culture" | "Science";

export function useFilteredNews(
    selectedCategory: CategoryName,
    searchText: string,

) {
    return useMemo(() => {
        let result = newsList;
        if (selectedCategory !== "All") {
            result = result.filter((news) => news.category === selectedCategory);
        }

        if (searchText.trim()) {
            const search = searchText.toLowerCase();
            result = result.filter(
                (news) =>
                    news.title.toLowerCase().includes(search) ||
                    news.sourceName.toLowerCase().includes(search)
            );
        }
        return result;
    }, [selectedCategory, searchText]);
}