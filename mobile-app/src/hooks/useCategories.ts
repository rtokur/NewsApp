import { useCallback, useEffect, useState } from "react";
import { Category } from "../types/category";
import { fetchCategories } from "../services/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoading] = useState(true);
  const [errorCategories, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchCategories();
      setCategories(result);
      setError(null);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const refetchCategories = useCallback(() => {
    loadCategories();
  }, [loadCategories]);

  return { 
    categories, 
    loadingCategories, 
    errorCategories, 
    refetchCategories 
  };
}