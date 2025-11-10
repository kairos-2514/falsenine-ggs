export interface UserAddress {
  PK: string; // e.g. "USER#user123"
  SK: string; // e.g. "ADDRESS"
  type: "USER_ADDRESS";
  userId: string; // e.g. "user123"
  fullName: string; // e.g. "John Doe"
  phoneNumber: string; // e.g. "+919876543210"
  addressLine1: string; // e.g. "123 MG Road"
  addressLine2?: string; // Optional e.g. "Near City Mall"
  city: string; // e.g. "Mumbai"
  state: string; // e.g. "Maharashtra"
  pinCode: string; // e.g. "400001"
  country: string; // e.g. "India"
  isDefault: boolean; // true if default address
  updatedAt: string; // ISO date string
}
