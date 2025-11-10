// ============================================================================
// AUTH UTILITIES
// ============================================================================

const USER_ID_KEY = "falsenine_userId";
const USER_DATA_KEY = "falsenine_userData";

export interface UserData {
  userId: string;
  email: string;
  name: string;
}

/**
 * Save user data to localStorage
 */
export const saveUserData = (userData: UserData): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_ID_KEY, userData.userId);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

/**
 * Get user data from localStorage
 */
export const getUserData = (): UserData | null => {
  if (typeof window === "undefined") return null;
  
  try {
    const userDataStr = localStorage.getItem(USER_DATA_KEY);
    if (userDataStr) {
      return JSON.parse(userDataStr) as UserData;
    }
  } catch {
    // Ignore parse errors
  }
  
  return null;
};

/**
 * Get userId from localStorage
 */
export const getUserId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ID_KEY);
};

/**
 * Clear user data (logout)
 */
export const clearUserData = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = (): boolean => {
  return getUserId() !== null;
};
