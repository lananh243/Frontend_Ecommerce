import axiosInstance from "@/utils/axiosInstance"

export const getAllCategories = async () => {
    const response = await axiosInstance.get("/categories");
    return response.data.data;
}

export const searchCategory = async (name: string) => {
    const response = await axiosInstance.get(`/categories/search?name=${name}`);
    return response.data;
}

export const sortCategory = async (order: string) => {
    const response = await axiosInstance.get(`/categories/sort?order=${order}`);
    return response.data;
}