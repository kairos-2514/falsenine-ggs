export interface Order {
  PK: string; // e.g. "USER#user123"
  SK: string; // e.g. "ORDER#2024-0001"
  type: "ORDER";
  userId: string;
  orderId: string; // e.g. "2024-0001"
  orderDate: string; // ISO date
  totalAmount: number;
  currency: string; // e.g. "INR"
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMethod: string; // e.g. "UPI", "Credit Card"
  shippingAddressId: string; // e.g. "ADDRESS#1"
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}
