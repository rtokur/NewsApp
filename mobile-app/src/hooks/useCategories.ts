import { useEffect, useState } from "react";
import { Category } from "../types/category";
import { fetchCategories } from "../services/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoading] = useState(true);
  const [errorCategories, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const result = await fetchCategories();
        if (isMounted) setCategories(result);
      } catch {
        if (isMounted) setError("Failed to load categories");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, loadingCategories, errorCategories };
}
