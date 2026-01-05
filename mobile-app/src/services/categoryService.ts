import { Category } from "../types/category";

import api from "./api";

export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await api.get("/categories");
        console.log("FetchCategories response data:", response.data);
        return response.data;
    } catch (err: any) {
        console.error("FetchCategories error details:", err.response || err.message);
        throw err;
    }
};