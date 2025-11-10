// ============================================================================
// API CONFIGURATION
// ============================================================================

/**
 * Base API URL
 * Can be configured via NEXT_PUBLIC_API_URL environment variable
 * Defaults to http://localhost:4000 for development
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Default fetch options
 */
export const defaultFetchOptions: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: ApiResponse
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Base fetch wrapper with error handling
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...defaultFetchOptions,
      ...options,
      headers: {
        ...defaultFetchOptions.headers,
        ...options?.headers,
      },
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors, timeouts, etc.
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError(
        "Network error. Please check your connection and try again."
      );
    }

    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}
