import { Request, Response } from "express";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../db/dynamo";
import { UserAddress } from "../models/userAddress";

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "EcommerceData";

/**
 * Create or update user address
 */
export const createOrUpdateAddress = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode,
      country,
      isDefault,
    } = req.body;

    // Validation
    if (
      !userId ||
      !fullName ||
      !phoneNumber ||
      !addressLine1 ||
      !city ||
      !state ||
      !pinCode ||
      !country
    ) {
      return res.status(400).json({
        success: false,
        error:
          "userId, fullName, phoneNumber, addressLine1, city, state, pinCode, and country are required",
      });
    }

    // Phone number validation (basic)
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        error: "Invalid phone number format",
      });
    }

    // Pin code validation (6 digits for India)
    if (!/^\d{6}$/.test(pinCode)) {
      return res.status(400).json({
        success: false,
        error: "Pin code must be 6 digits",
      });
    }

    const PK = `USER#${userId}`;
    const SK = "ADDRESS";

    // If this is set as default, unset other default addresses
    if (isDefault) {
      // Note: In a production app, you might want to query and update other addresses
      // For now, we'll just set this one as default
    }

    // Create address object
    const userAddress: UserAddress = {
      PK,
      SK,
      type: "USER_ADDRESS",
      userId,
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2?.trim(),
      city: city.trim(),
      state: state.trim(),
      pinCode: pinCode.trim(),
      country: country.trim(),
      isDefault: isDefault ?? true,
      updatedAt: new Date().toISOString(),
    };

    // Save to DynamoDB
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: userAddress,
    });

    await ddbDocClient.send(command);

    return res.status(201).json({
      success: true,
      message: "Address saved successfully",
      data: {
        userId: userAddress.userId,
        fullName: userAddress.fullName,
        city: userAddress.city,
        state: userAddress.state,
      },
    });
  } catch (error) {
    console.error("Error saving address:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to save address. Please try again later.",
    });
  }
};

/**
 * Get user address
 */
export const getUserAddress = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    const PK = `USER#${userId}`;
    const SK = "ADDRESS";

    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK,
        SK,
      },
    });

    const result = await ddbDocClient.send(command);

    // Type assertion for GetCommand output
    const getResult = result as { Item?: UserAddress };

    if (!getResult.Item) {
      return res.status(404).json({
        success: false,
        error: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: getResult.Item,
    });
  } catch (error) {
    console.error("Error getting address:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to get address. Please try again later.",
    });
  }
};

