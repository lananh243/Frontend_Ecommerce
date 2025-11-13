import { OrderRequest } from "@/types";
import axiosInstance from "@/utils/axiosInstance";

export const createOrder = async (order: OrderRequest, email: string) => {
    const response = await axiosInstance.post(`orders?email=${email}`, order);
    return response.data;
}


export const getOrderLastest = async (email: string) => {
    const response = await axiosInstance.get(`/orders/latest?email=${email}`);
    return response.data;
}


export const getOrderByStatus = async (status: string, email: string) => {
  const response = await axiosInstance.get(`/orders?status=${status}&email=${email}`);
  return response.data.data;
};


export const getOrderDetail = async (orderId: number) => {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data.data; 
};

