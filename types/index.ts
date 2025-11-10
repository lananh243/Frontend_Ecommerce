export interface User {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    gender?: Gender,
    phoneNumber?: string,
    avatarUrl?: string,
}

export enum Gender {
    MALE, FEMALE, OTHER
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterResponse {
  token: string;
  data: User[];
}

export interface LoginResponse {
    token: string;
    data: User[];
}

export type ErrorState = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export interface ProductResponse {
  productId: number;
  productName?: string;
  description?: string;
  price?: string;
  stockQuantity?: number;    
  imageUrl?: string;         
  categoryName?: string;  
  sizes?: string[];
  colors?: string[];   
}

export interface CartItemType {
  cartItemId: number;
  product: ProductResponse;
  quantity: number;
  color?: string;
  size?: string;
  checked?: boolean;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
  color?: string;
  size?: string;
}
