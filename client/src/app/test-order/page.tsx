"use client";

import { useState } from "react";
import axios from "axios";

interface OrderSaveResponse {
  success: boolean;
  orderId?: string;
  error?: string;
  message?: string;
  [key: string]: unknown;
}

export default function TestOrderPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrderSaveResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sample product IDs from your DynamoDB
  const sampleProducts = [
    { id: "frontline", name: "Frontline" },
    { id: "reign", name: "Reign" },
  ];

  const [formData, setFormData] = useState({
    orderId: `TEST_ORD_${Date.now()}`,
    userId: "user_48f362eb-664b-450d-9f6e-703908ac9965",
    userEmail: "test@example.com",
    totalAmount: 20,
    currency: "INR",
    orderStatus: "PAID",
    items: [
      {
        productId: "frontline",
        productName: "Frontline",
        quantity: 1,
        pricePerUnit: 10,
        totalPrice: 10,
        selectedSize: "M",
      },
      {
        productId: "reign",
        productName: "Reign",
        quantity: 1,
        pricePerUnit: 10,
        totalPrice: 10,
        selectedSize: "L",
      },
    ],
    shippingAddress: {
      fullName: "Test User",
      phoneNumber: "+919876543210",
      addressLine1: "123 Test Street",
      addressLine2: "Apt 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pinCode: "400001",
      country: "India",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("🧪 Sending test order data:", JSON.stringify(formData, null, 2));

      const response = await axios.post(
        "http://localhost:4000/api/orders/test-save",
        {
          ...formData,
          createdAt: new Date().toISOString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      console.log("✅ Response received:", response.data);
      setResult(response.data);
    } catch (err: unknown) {
      console.error("❌ Error:", err);
      const isAxiosError = axios.isAxiosError(err);
      const errorMessage = isAxiosError
        ? err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unknown error"
        : err instanceof Error
        ? err.message
        : "Unknown error";

      setError(errorMessage);
      if (isAxiosError) {
        console.error("Response status:", err.response?.status);
        console.error("Response data:", err.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          productId: "frontline",
          productName: "Frontline",
          quantity: 1,
          pricePerUnit: 10,
          totalPrice: 10,
          selectedSize: "M",
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === "quantity" || field === "pricePerUnit") {
      newItems[index].totalPrice =
        Number(newItems[index].quantity) * Number(newItems[index].pricePerUnit);
    }
    setFormData({ ...formData, items: newItems });
  };

  return (
    <main className="min-h-screen bg-white pt-20 px-4 py-8 sm:px-6 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-thunder text-4xl font-extralight uppercase tracking-tight text-night mb-8">
          Test Order Save
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Order Info */}
          <div className="border border-night/10 p-6 space-y-4">
            <h2 className="font-montserrat text-lg font-bold uppercase tracking-wide text-night">
              Order Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-montserrat text-xs font-normal uppercase tracking-wide text-night/70 mb-1">
                  Order ID
                </label>
                <input
                  type="text"
                  value={formData.orderId}
                  onChange={(e) =>
                    setFormData({ ...formData, orderId: e.target.value })
                  }
                  className="w-full border border-night/30 px-3 py-2 font-montserrat text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-montserrat text-xs font-normal uppercase tracking-wide text-night/70 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  className="w-full border border-night/30 px-3 py-2 font-montserrat text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-montserrat text-xs font-normal uppercase tracking-wide text-night/70 mb-1">
                  User Email
                </label>
                <input
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, userEmail: e.target.value })
                  }
                  className="w-full border border-night/30 px-3 py-2 font-montserrat text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-montserrat text-xs font-normal uppercase tracking-wide text-night/70 mb-1">
                  Total Amount
                </label>
                <input
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-night/30 px-3 py-2 font-montserrat text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border border-night/10 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-montserrat text-lg font-bold uppercase tracking-wide text-night">
                Order Items
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 bg-night text-white font-montserrat text-xs uppercase tracking-wide hover:bg-night/90"
              >
                Add Item
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div
                key={index}
                className="border border-night/20 p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-montserrat text-sm font-bold uppercase text-night">
                    Item {index + 1}
                  </h3>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 font-montserrat text-xs uppercase"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-montserrat text-[10px] font-normal uppercase tracking-wide text-night/70 mb-1">
                      Product ID
                    </label>
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        updateItem(index, "productId", e.target.value)
                      }
                      className="w-full border border-night/30 px-2 py-1 font-montserrat text-xs"
                    >
                      {sampleProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-montserrat text-[10px] font-normal uppercase tracking-wide text-night/70 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={item.productName}
                      onChange={(e) =>
                        updateItem(index, "productName", e.target.value)
                      }
                      className="w-full border border-night/30 px-2 py-1 font-montserrat text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-[10px] font-normal uppercase tracking-wide text-night/70 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", parseInt(e.target.value) || 1)
                      }
                      className="w-full border border-night/30 px-2 py-1 font-montserrat text-xs"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-[10px] font-normal uppercase tracking-wide text-night/70 mb-1">
                      Price Per Unit
                    </label>
                    <input
                      type="number"
                      value={item.pricePerUnit}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "pricePerUnit",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full border border-night/30 px-2 py-1 font-montserrat text-xs"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-[10px] font-normal uppercase tracking-wide text-night/70 mb-1">
                      Size
                    </label>
                    <select
                      value={item.selectedSize}
                      onChange={(e) =>
                        updateItem(index, "selectedSize", e.target.value)
                      }
                      className="w-full border border-night/30 px-2 py-1 font-montserrat text-xs"
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-montserrat text-[10px] font-normal uppercase tracking-wide text-night/70 mb-1">
                      Total Price
                    </label>
                    <input
                      type="number"
                      value={item.totalPrice}
                      readOnly
                      className="w-full border border-night/30 px-2 py-1 font-montserrat text-xs bg-night/5"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="border border-night/10 p-6 space-y-4">
            <h2 className="font-montserrat text-lg font-bold uppercase tracking-wide text-night">
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-montserrat text-xs font-normal uppercase tracking-wide text-night/70 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: {
                        ...formData.shippingAddress,
                        fullName: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-night/30 px-3 py-2 font-montserrat text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-montserrat text-xs font-normal uppercase tracking-wide text-night/70 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress.phoneNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: {
                        ...formData.shippingAddress,
                        phoneNumber: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-night/30 px-3 py-2 font-montserrat text-sm"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-montserrat text-xs font-normal uppercase tracking-wide text-night/70 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress.addressLine1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: {
                        ...formData.shippingAddress,
                        addressLine1: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-night/30 px-3 py-2 font-montserrat text-sm"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-montserrat text-xs font-normal uppercase tracking-wide text-night/70 mb-1">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress.addressLine2 || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: {
                        ...formData.shippingAddress,
                        addressLine2: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-night/30 px-3 py-2 font-montserrat text-sm"
                />
              </div>

              <div>
                <label className="block font-montserrat text-xs font-normal uppercase tracking-wide text-night/70 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: {
                        ...formData.shippingAddress,
                        city: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-night/30 px-3 py-2 font-montserrat text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-montserrat text-xs font-normal uppercase tracking-wide text-night/70 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: {
                        ...formData.shippingAddress,
                        state: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-night/30 px-3 py-2 font-montserrat text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-montserrat text-xs font-normal uppercase tracking-wide text-night/70 mb-1">
                  Pin Code
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress.pinCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: {
                        ...formData.shippingAddress,
                        pinCode: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-night/30 px-3 py-2 font-montserrat text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-montserrat text-xs font-normal uppercase tracking-wide text-night/70 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: {
                        ...formData.shippingAddress,
                        country: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-night/30 px-3 py-2 font-montserrat text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-night text-white font-montserrat text-sm font-normal uppercase tracking-wide hover:bg-night/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Test Order"}
            </button>

            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  orderId: `TEST_ORD_${Date.now()}`,
                });
              }}
              className="px-8 py-3 border border-night/30 bg-white text-night font-montserrat text-sm font-normal uppercase tracking-wide hover:border-night"
            >
              Generate New Order ID
            </button>
          </div>
        </form>

        {/* Results */}
        {result && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200">
            <h3 className="font-montserrat text-lg font-bold uppercase tracking-wide text-green-800 mb-2">
              ✅ Success!
            </h3>
            <pre className="font-montserrat text-xs text-green-700 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-8 p-6 bg-red-50 border border-red-200">
            <h3 className="font-montserrat text-lg font-bold uppercase tracking-wide text-red-800 mb-2">
              ❌ Error
            </h3>
            <p className="font-montserrat text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}

