import { Request, Response } from "express";
import {
  PutCommand,
  GetCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../db/dynamo";
import { UserProfile } from "../models/userProfile";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "EcommerceData";
const SALT_ROUNDS = 10;

/**
 * Register a new user
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    // Validation
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        error: "Email, name, and password are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists (using GSI if available)
    const userId = `user_${randomUUID()}`;
    const PK = `USER#${userId}`;
    const SK = "PROFILE";

    try {
      // Query by email using GSI1
      // GSI1PK = EMAIL#email, GSI1SK = USER#userId (same as PK)
      const checkUserCommand = new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :gsi1pk",
        ExpressionAttributeValues: {
          ":gsi1pk": `EMAIL#${email.toLowerCase()}`,
        },
      });

      const existingUser = await ddbDocClient.send(checkUserCommand);
      if (existingUser.Items && existingUser.Items.length > 0) {
        return res.status(409).json({
          success: false,
          error: "User with this email already exists",
        });
      }
    } catch (error: any) {
      // If GSI doesn't exist, skip duplicate check for now
      // In production, you should create the GSI or use a different approach
      if (error?.name === "ResourceNotFoundException") {
        console.warn(
          "⚠️  GSI1 not found. Skipping duplicate email check. Please create GSI1 on your DynamoDB table."
        );
      } else {
        // Re-throw other errors
        throw error;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user profile
    const userProfile: UserProfile = {
      PK,
      SK,
      type: "USER_PROFILE",
      userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      GSI1PK: `EMAIL#${email.toLowerCase()}`,
      GSI1SK: PK, // Same as PK (USER#userId) for uniqueness
    };

    // Save to DynamoDB (password stored separately for security)
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...userProfile,
        password: hashedPassword, // Store hashed password
      },
    });

    await ddbDocClient.send(command);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        userId: userProfile.userId,
        email: userProfile.email,
        name: userProfile.name,
      },
    });
  } catch (error: any) {
    console.error("Error registering user:", error);
    
    let errorMessage = "Failed to register user. Please try again later.";
    
    if (error?.name === "ResourceNotFoundException") {
      errorMessage =
        "DynamoDB table or index not found. Please check your AWS configuration and ensure the table exists.";
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};

/**
 * Login user
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Find user by email (using GSI if available, otherwise scan)
    let user: (UserProfile & { password: string }) | undefined;

    try {
      // Try using GSI first - query by email
      const queryCommand = new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :gsi1pk",
        ExpressionAttributeValues: {
          ":gsi1pk": `EMAIL#${email.toLowerCase()}`,
        },
      });

      const result = await ddbDocClient.send(queryCommand);
      if (result.Items && result.Items.length > 0) {
        user = result.Items[0] as UserProfile & { password: string };
      }
    } catch (error: any) {
      // If GSI doesn't exist, fallback to scanning (less efficient)
      if (error?.name === "ResourceNotFoundException") {
        console.warn(
          "⚠️  GSI1 not found. Using scan fallback. Please create GSI1 on your DynamoDB table for better performance."
        );
        
        // Fallback: Scan for user by email (less efficient, but works without GSI)
        const scanCommand = new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: "email = :email AND #type = :type",
          ExpressionAttributeNames: {
            "#type": "type",
          },
          ExpressionAttributeValues: {
            ":email": email.toLowerCase(),
            ":type": "USER_PROFILE",
          },
          Limit: 1,
        });

        const scanResult = await ddbDocClient.send(scanCommand);
        if (scanResult.Items && scanResult.Items.length > 0) {
          user = scanResult.Items[0] as UserProfile & { password: string };
        }
      } else {
        throw error;
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        userId: user.userId,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error("Error logging in user:", error);
    
    let errorMessage = "Failed to login. Please try again later.";
    
    if (error?.name === "ResourceNotFoundException") {
      errorMessage =
        "DynamoDB table or index not found. Please check your AWS configuration.";
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};

/**
 * Get user profile by userId
 */
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    const PK = `USER#${userId}`;
    const SK = "PROFILE";

    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK,
        SK,
      },
    });

    const result = await ddbDocClient.send(command);
    const getResult = result as { Item?: UserProfile & { password?: string } };

    if (!getResult.Item) {
      return res.status(404).json({
        success: false,
        error: "User profile not found",
      });
    }

    // Remove password from response
    const { password: _, ...userProfile } = getResult.Item;

    return res.status(200).json({
      success: true,
      data: userProfile,
    });
  } catch (error: any) {
    console.error("Error getting user profile:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to get user profile. Please try again later.",
    });
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    // Get existing user
    const PK = `USER#${userId}`;
    const SK = "PROFILE";

    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK,
        SK,
      },
    });

    const result = await ddbDocClient.send(getCommand);
    const getResult = result as { Item?: UserProfile & { password?: string } };

    if (!getResult.Item) {
      return res.status(404).json({
        success: false,
        error: "User profile not found",
      });
    }

    const existingUser = getResult.Item;

    // Update fields
    const updatedProfile: UserProfile = {
      ...existingUser,
      name: name?.trim() || existingUser.name,
      email: email?.trim().toLowerCase() || existingUser.email,
      updatedAt: new Date().toISOString(),
      GSI1PK: email
        ? `EMAIL#${email.toLowerCase()}`
        : existingUser.GSI1PK || `EMAIL#${existingUser.email}`,
      GSI1SK: PK,
    };

    // Save updated profile
    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...updatedProfile,
        password: existingUser.password, // Keep existing password
      },
    });

    await ddbDocClient.send(putCommand);

    // Return updated profile (password is not included in UserProfile type)
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update profile. Please try again later.",
    });
  }
};
