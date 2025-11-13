import axiosInstance from "@/utils/axiosInstance"

export const comment = async (data: { productId: number; rating: number; comment: string }) => {
    const response = await axiosInstance.post("/reviews", data);
    return response.data;
}


export const getAllComment = async (productId: number) => {
    const response = await axiosInstance.get(`/reviews/product/${productId}`);
    return response.data;
}