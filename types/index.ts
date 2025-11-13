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
  firstName?: string;
  lastName?: string;
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
  firstName?: string;
  lastName?: string;
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

export interface OrderItemRequest {
  productId: number;
  quantity: number;
  color?: string; // optional
  size?: string;  // optional
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number; // VND
  color?: string;
  size?: string;
}

export interface OrderRequest {
  firstName: string;
  lastName: string;
  street: string;
  city?: string;
  state?: string;
  country?: string;
  zip: string;
  phone: string;
  shippingMethod: "free" | "normal" | "fast";
  shippingPrice?: number; 
  orderItems: OrderItemRequest[];
  couponCode?: string;
}

export interface ErrorOrder {
  firstName: string;
  lastName: string;
  street: string;
  city?: string;
  state?: string;
  country?: string;
  zip: string;
  phone: string;
  shippingMethod: "free" | "normal" | "fast";
  shippingPrice?: number; 
  orderItems: OrderItemRequest[];
  couponCode?: string;
}


export interface OrderResponse {
  id: number;
  userId: number;
  orderStatus: "PENDING" | "DELIVERED" | "CANCELLED";
  shippingAddress: string;
  shippingMethod: string;
  shippingPrice: number;
  totalPrice: number; // VND
  createdAt: string;  // ISO string
  orderItems: OrderItemResponse[];
}
