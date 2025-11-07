import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/types";
import axiosInstance from "@/utils/axiosInstance";

export const registerUser = async (data: RegisterRequest) => {
  try {
    const res = await axiosInstance.post("/auths/register", data);
    return res.data;
  } catch (err: any) {
    throw err;
  }
};


export const loginUser = async (data: LoginRequest) => {
    try {
      const response = await axiosInstance.post("/auths/login", data);
      return response.data;
    } catch (error) {
      throw error;
    }
}

export const getAllUsers = async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
}