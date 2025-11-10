// ============================================================================
// PRODUCT API
// ============================================================================

import { apiFetch, ApiResponse } from "./config";
import { Product } from "@/types/product";
import { getProductImage } from "@/config/images";

/**
 * Server product response (matches DynamoDB structure)
 */
export interface ServerProduct {
  PK: string;
  SK: string;
  type: "PRODUCT";
  id: string;
  pName: string;
  pPrice: number;
  pDescription: string;
  pSizes: string[];
  pCategory: string;
  pFit: string;
  image: string;
  stock: {
    [size: string]: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  category?: string;
}

/**
 * Transform server product to client product format
 */
function transformProduct(serverProduct: ServerProduct): Product {
  // Use image from images.ts config instead of DynamoDB
  // This ensures images are loaded from .env.local and images.ts
  const imageUrl = getProductImage(serverProduct.id);

  return {
    id: serverProduct.id,
    pName: serverProduct.pName,
    pPrice: serverProduct.pPrice,
    pDescription: serverProduct.pDescription,
    pSizes: serverProduct.pSizes,
    pCategory: serverProduct.pCategory,
    pFit: serverProduct.pFit,
    image: imageUrl,
    stock: serverProduct.stock,
  };
}

/**
 * Get all products
 */
export async function getAllProducts(): Promise<ApiResponse<Product[]>> {
  const response = await apiFetch<ServerProduct[]>("/api/products", {
    method: "GET",
  });

  if (response.success && response.data) {
    return {
      success: true,
      data: response.data.map(transformProduct),
    };
  }

  return {
    success: false,
    error: response.error || "Failed to fetch products",
  };
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<ApiResponse<Product>> {
  const response = await apiFetch<ServerProduct>(`/api/products/${id}`, {
    method: "GET",
  });

  if (response.success && response.data) {
    return {
      success: true,
      data: transformProduct(response.data),
    };
  }

  return {
    success: false,
    error: response.error || "Failed to fetch product",
  };
}

