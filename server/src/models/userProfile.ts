export interface UserProfile {
  PK: string; // e.g. "USER#user123"
  SK: string; // e.g. "PROFILE"
  type: "USER_PROFILE";
  userId: string; // e.g. "user123"
  name: string; // e.g. "John Doe"
  email: string; // e.g. "john@example.com"
  createdAt: string; // ISO date string
  updatedAt?: string; // Optional ISO date string
  GSI1PK?: string; // GSI key 
  GSI1SK?: string; //  GSI sort key 
}
