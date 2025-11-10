// ============================================================================
// PRODUCT TYPES
// ============================================================================

export interface Product {
  id: string;
  pName: string;
  pPrice: number;
  pDescription: string;
  pSizes: string[];
  pCategory: string;
  pFit: string;
  image: string;
  stock?: {
    [size: string]: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

