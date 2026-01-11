import { Category } from "../types/category";

import api from "./api";

export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await api.get("v1/categories");
        console.log("FetchCategories response data:", response.data);
        return response.data;
    } catch (err: any) {
        throw err;
    }
};