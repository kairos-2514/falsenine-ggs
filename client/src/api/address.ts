// ============================================================================
// ADDRESS API
// ============================================================================

import { apiFetch, ApiResponse } from "./config";

/**
 * Address data
 */
export interface AddressData {
  userId: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  isDefault?: boolean;
}

/**
 * Address response
 */
export interface AddressResponse {
  userId: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  isDefault: boolean;
  updatedAt: string;
}

/**
 * Save user address
 */
export async function saveAddress(
  data: AddressData
): Promise<ApiResponse<AddressResponse>> {
  return apiFetch<AddressResponse>("/api/address", {
    method: "POST",
    body: JSON.stringify({
      userId: data.userId,
      fullName: data.fullName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      addressLine1: data.addressLine1.trim(),
      addressLine2: data.addressLine2?.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      pinCode: data.pinCode.trim(),
      country: data.country.trim(),
      isDefault: data.isDefault ?? true,
    }),
  });
}

/**
 * Get user address
 */
export async function getUserAddress(
  userId: string
): Promise<ApiResponse<AddressResponse>> {
  return apiFetch<AddressResponse>(`/api/address/${userId}`, {
    method: "GET",
  });
}

