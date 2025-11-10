// ============================================================================
// CART UTILITIES
// ============================================================================

import { CartItem, Product } from "@/types/product";

const CART_STORAGE_KEY = "falsenine_cart";

/**
 * Get cart items from localStorage
 */
export const getCartItems = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch {
    return [];
  }
};

/**
 * Save cart items to localStorage
 */
export const saveCartItems = (items: CartItem[]): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  } catch (error) {
    console.error("Failed to save cart:", error);
  }
};

/**
 * Get available stock for a product size
 */
export const getAvailableStock = (
  product: Product,
  size: string
): number => {
  if (!product.stock) return 999; // No stock limit if stock not available
  return product.stock[size] || 0;
};

/**
 * Get current cart quantity for a product size
 */
export const getCartQuantity = (
  productId: string,
  size: string
): number => {
  const cartItems = getCartItems();
  const item = cartItems.find(
    (item) => item.id === productId && item.selectedSize === size
  );
  return item ? item.quantity : 0;
};

/**
 * Add item to cart with stock validation
 */
export const addToCart = (
  product: Product,
  selectedSize: string,
  quantity: number = 1
): { success: boolean; error?: string } => {
  const availableStock = getAvailableStock(product, selectedSize);
  const currentCartQuantity = getCartQuantity(product.id, selectedSize);
  const requestedQuantity = currentCartQuantity + quantity;

  if (requestedQuantity > availableStock) {
    return {
      success: false,
      error: `Only ${availableStock} available in stock. You already have ${currentCartQuantity} in cart.`,
    };
  }

  const cartItems = getCartItems();
  
  // Check if item with same product and size already exists
  const existingItemIndex = cartItems.findIndex(
    (item) => item.id === product.id && item.selectedSize === selectedSize
  );

  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    const newItem: CartItem = {
      ...product,
      quantity,
      selectedSize,
    };
    cartItems.push(newItem);
  }

  saveCartItems(cartItems);
  return { success: true };
};

/**
 * Remove item from cart
 */
export const removeFromCart = (itemId: string, selectedSize: string): void => {
  const cartItems = getCartItems();
  const filtered = cartItems.filter(
    (item) => !(item.id === itemId && item.selectedSize === selectedSize)
  );
  saveCartItems(filtered);
};

/**
 * Update item quantity in cart with stock validation
 */
export const updateCartItemQuantity = (
  itemId: string,
  selectedSize: string,
  quantity: number,
  product?: Product
): { success: boolean; error?: string } => {
  if (quantity < 1) {
    removeFromCart(itemId, selectedSize);
    return { success: true };
  }

  // Check stock if product is provided
  if (product) {
    const availableStock = getAvailableStock(product, selectedSize);
    if (quantity > availableStock) {
      return {
        success: false,
        error: `Only ${availableStock} available in stock.`,
      };
    }
  }

  const cartItems = getCartItems();
  const updated = cartItems.map((item) =>
    item.id === itemId && item.selectedSize === selectedSize
      ? { ...item, quantity }
      : item
  );
  saveCartItems(updated);
  return { success: true };
};

/**
 * Clear entire cart
 */
export const clearCart = (): void => {
  saveCartItems([]);
};

/**
 * Get cart total
 */
export const getCartTotal = (): number => {
  const cartItems = getCartItems();
  return cartItems.reduce(
    (total, item) => total + item.pPrice * item.quantity,
    0
  );
};

