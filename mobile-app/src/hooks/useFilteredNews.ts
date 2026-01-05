import { useMemo } from "react";
import { News } from "../types/news";
import { Category } from "../types/category";

export function useFilteredNews(
  news: News[],
  selectedCategory: Category,
  searchText: string
) {
  return useMemo(() => {
    return news.filter((item) => {
      const matchCategory =
        selectedCategory.name === "All" ||
        item.category?.id === selectedCategory.id;

      const matchSearch =
        item.title.toLowerCase().includes(searchText.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [news, selectedCategory, searchText]);
}
