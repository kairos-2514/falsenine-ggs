// ============================================================================
// AUTH API
// ============================================================================

import { apiFetch, ApiResponse } from "./config";

/**
 * Register request data
 */
export interface RegisterData {
  email: string;
  name: string;
  password: string;
}

/**
 * Login request data
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * User response data
 */
export interface UserResponse {
  userId: string;
  email: string;
  name: string;
}

/**
 * Register a new user
 */
export async function registerUser(
  data: RegisterData
): Promise<ApiResponse<UserResponse>> {
  return apiFetch<UserResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: data.email.trim(),
      name: data.name.trim(),
      password: data.password,
    }),
  });
}

/**
 * Login user
 */
export async function loginUser(
  data: LoginData
): Promise<ApiResponse<UserResponse>> {
  return apiFetch<UserResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: data.email.trim(),
      password: data.password,
    }),
  });
}

/**
 * User profile data
 */
export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Get user profile
 */
export async function getUserProfile(
  userId: string
): Promise<ApiResponse<UserProfile>> {
  return apiFetch<UserProfile>(`/api/auth/profile/${userId}`, {
    method: "GET",
  });
}

/**
 * Update user profile data
 */
export interface UpdateProfileData {
  name?: string;
  email?: string;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: UpdateProfileData
): Promise<ApiResponse<UserProfile>> {
  return apiFetch<UserProfile>(`/api/auth/profile/${userId}`, {
    method: "PUT",
    body: JSON.stringify({
      name: data.name?.trim(),
      email: data.email?.trim(),
    }),
  });
}

