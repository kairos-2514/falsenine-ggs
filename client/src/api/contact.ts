// ============================================================================
// CONTACT API
// ============================================================================

import { apiFetch, ApiResponse } from "./config";

/**
 * Contact message data
 */
export interface ContactMessageData {
  name: string;
  email: string;
  message: string;
}

/**
 * Contact message response
 */
export interface ContactMessageResponse {
  message_id: string;
}

/**
 * Send a contact message
 * @param data - Contact message data (name, email, message)
 * @returns API response with message_id
 */
export async function sendContactMessage(
  data: ContactMessageData
): Promise<ApiResponse<ContactMessageResponse>> {
  return apiFetch<ContactMessageResponse>("/api/contact", {
    method: "POST",
    body: JSON.stringify({
      name: data.name.trim(),
      email: data.email.trim(),
      message: data.message.trim(),
    }),
  });
}
