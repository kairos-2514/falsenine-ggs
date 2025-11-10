export interface Product {
  PK: string; // e.g. "PRODUCT#crossfade"
  SK: string; // e.g. "METADATA"
  type: "PRODUCT";
  id: string; // e.g. "crossfade"
  pName: string;
  pPrice: number;
  pDescription: string;
  pSizes: string[];
  pCategory: string;
  pFit: string;
  image: string;
  stock: {
    [size: string]: number; // e.g. { "S": 5, "M": 5, "L": 5, "XL": 5 }
  };
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  category?: string;
}
