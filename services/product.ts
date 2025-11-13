import axiosInstance from "@/utils/axiosInstance";

export const getAllProduct = async () => {
    const response = await axiosInstance.get("/products");
    return response.data;
}


export const searchProductName = async (keyword: string) => {
  const response = await axiosInstance.get(`/products/search?keyword=${keyword}`);
  return response.data;
};

export const detailProduct = async (productId: number) => {
  const response = await axiosInstance.get(`/products/${productId}`);
  return response.data;
}

export const getFilteredProducts = async (filters: any) => {
  const params = new URLSearchParams();

  if (filters.minPrice !== undefined) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice);
  if (filters.color) params.append("color", filters.color);
  if (filters.size && filters.size.length)
    params.append("size", filters.size.join(","));
  if (filters.categoryId) params.append("categoryId", filters.categoryId);

  const response = await axiosInstance.get(`/products/filter?${params.toString()}`);  
  return response.data.data; 
};


export const getProductsByCategory = async (categoryId: number) => {
  const response = await axiosInstance.get(`/products/category/${categoryId}`);
  return response.data?.data ?? [];
}