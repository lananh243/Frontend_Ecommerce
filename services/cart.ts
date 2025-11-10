import { AddToCartRequest, CartItemType } from "@/types";
import axiosInstance from "@/utils/axiosInstance"

export const addToCart = async (userId: number, cartItem: AddToCartRequest) => {
    try {
        const response = await axiosInstance.post(`/carts/${userId}/add`, cartItem);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAllCart = async (userId: number) => {
    const response = await axiosInstance.get(`/carts/${userId}`);    
    return response.data;
}

export const updateQuantityCart  = async (cartItemId: number, quantity: number) => {
    const response = await axiosInstance.put(`/carts/item/${cartItemId}?quantity=${quantity}`);
    return response.data;
}


export const deleteCartItemId = async (cartItemId: number) => {
    const response = await axiosInstance.delete(`/carts/item/${cartItemId}`);
    return response.data;
}


export const clearCart = async (userId: number) => {
    const response = await axiosInstance.delete(`/carts/${userId}/clear`);
    return response.data;
}