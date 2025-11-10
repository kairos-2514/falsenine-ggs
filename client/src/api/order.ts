import axios from "axios";
import { ApiResponse, ApiError } from "./config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface OrderItem {
  productId: string;
  productName: string;
  productDescription?: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  selectedSize?: string;
  image?: string;
}

export interface OrderMetadata {
  orderId: string;
  userId: string;
  userEmail: string;
  orderStatus: string;
  totalAmount: number;
  currency: string;
  shippingAddress: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  items: OrderItem[];
}

export async function getUserOrders(
  userId: string
): Promise<ApiResponse<OrderMetadata[]>> {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/orders/user/${userId}`
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new ApiError(
        error.response.data?.error || "Failed to fetch orders",
        error.response.status
      );
    }
    throw new ApiError("Network error. Please check your connection.");
  }
}

export async function getOrderById(
  orderId: string
): Promise<ApiResponse<OrderMetadata>> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new ApiError(
        error.response.data?.error || "Failed to fetch order",
        error.response.status
      );
    }
    throw new ApiError("Network error. Please check your connection.");
  }
}

