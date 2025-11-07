import axiosInstance from "@/utils/axiosInstance";

export const getAllProduct = async () => {
    const response = await axiosInstance.get("/products");
    return response.data;
}


export const searchProductName = async (keyword: string) => {
  const response = await axiosInstance.get(`/products/search?keyword=${keyword}`);
  return response.data;
};