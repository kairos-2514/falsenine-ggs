import { Request, Response } from "express";
import { ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../db/dynamo";
import { Product } from "../models/product";

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "EcommerceData";

/**
 * Get all active products
 */
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Scan for all products with type = "PRODUCT" and isActive = true
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "#type = :type AND isActive = :isActive",
      ExpressionAttributeNames: {
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":type": "PRODUCT",
        ":isActive": true,
      },
    });

    const result = await ddbDocClient.send(command);

    // Transform DynamoDB items to Product format
    const products: Product[] = (result.Items || []).map((item) => {
      // Handle pSizes array conversion
      let pSizes: string[] = [];
      if (item.pSizes && Array.isArray(item.pSizes)) {
        pSizes = item.pSizes.map((size: any) => {
          if (typeof size === "string") return size;
          if (size.S) return size.S; // DynamoDB string format
          return String(size);
        });
      }

      // Handle stock object conversion
      let stock: { [size: string]: number } = {};
      if (item.stock && typeof item.stock === "object") {
        Object.keys(item.stock).forEach((size) => {
          const stockValue = item.stock[size];
          if (typeof stockValue === "number") {
            stock[size] = stockValue;
          } else if (stockValue?.N) {
            // DynamoDB number format
            stock[size] = parseInt(stockValue.N, 10);
          } else if (typeof stockValue === "string") {
            stock[size] = parseInt(stockValue, 10);
          }
        });
      }

      return {
        PK: item.PK || "",
        SK: item.SK || "METADATA",
        type: item.type || "PRODUCT",
        id: item.id || "",
        pName: item.pName || "",
        pPrice: typeof item.pPrice === "number" ? item.pPrice : parseInt(String(item.pPrice || 0), 10),
        pDescription: item.pDescription || "",
        pSizes,
        pCategory: item.pCategory || "",
        pFit: item.pFit || "",
        image: item.image || "",
        stock,
        isActive: item.isActive !== undefined ? item.isActive : true,
        createdAt: item.createdAt || "",
        updatedAt: item.updatedAt,
        category: item.category || item.pCategory,
      } as Product;
    });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    console.error("Error getting products:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to get products. Please try again later.",
    });
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required",
      });
    }

    const PK = `PRODUCT#${id}`;
    const SK = "METADATA";

    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK,
        SK,
      },
    });

    const result = await ddbDocClient.send(command);
    const getResult = result as { Item?: any };

    if (!getResult.Item) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    const item = getResult.Item;

    // Handle pSizes array conversion
    let pSizes: string[] = [];
    if (item.pSizes && Array.isArray(item.pSizes)) {
      pSizes = item.pSizes.map((size: any) => {
        if (typeof size === "string") return size;
        if (size.S) return size.S; // DynamoDB string format
        return String(size);
      });
    }

    // Handle stock object conversion
    let stock: { [size: string]: number } = {};
    if (item.stock && typeof item.stock === "object") {
      Object.keys(item.stock).forEach((size) => {
        const stockValue = item.stock[size];
        if (typeof stockValue === "number") {
          stock[size] = stockValue;
        } else if (stockValue?.N) {
          // DynamoDB number format
          stock[size] = parseInt(stockValue.N, 10);
        } else if (typeof stockValue === "string") {
          stock[size] = parseInt(stockValue, 10);
        }
      });
    }

    const product: Product = {
      PK: item.PK || "",
      SK: item.SK || "METADATA",
      type: item.type || "PRODUCT",
      id: item.id || "",
      pName: item.pName || "",
      pPrice: typeof item.pPrice === "number" ? item.pPrice : parseInt(String(item.pPrice || 0), 10),
      pDescription: item.pDescription || "",
      pSizes,
      pCategory: item.pCategory || "",
      pFit: item.pFit || "",
      image: item.image || "",
      stock,
      isActive: item.isActive !== undefined ? item.isActive : true,
      createdAt: item.createdAt || "",
      updatedAt: item.updatedAt,
      category: item.category || item.pCategory,
    };

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error("Error getting product:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to get product. Please try again later.",
    });
  }
};

