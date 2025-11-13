import axiosInstance from "@/utils/axiosInstance";

export const addToWishList = async (productId: number) => {
    const response = await axiosInstance.post(`/wishlist/${productId}`);
    return response.data;
}

export const getWishlist = async () => {
    const response = await axiosInstance.get("/wishlist");
    return response.data.data ?? [];
}

export const deleteWishlist = async (productId: number) => {
    const response = await axiosInstance.delete(`/wishlist/${productId}`);
    return response.data;
}