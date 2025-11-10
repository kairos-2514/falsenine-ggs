import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Get AWS configuration from environment variables
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION || "us-east-1";

// Configure DynamoDB client
// If credentials are provided in env, use them; otherwise, AWS SDK will use default credential provider chain
// (environment variables, shared credentials file, IAM roles, etc.)
const clientConfig: {
  region: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
} = {
  region,
};

// Only explicitly set credentials if both are provided in environment variables
if (accessKeyId && secretAccessKey) {
  clientConfig.credentials = {
    accessKeyId,
    secretAccessKey,
  };
} else {
  console.warn(
    "⚠️  AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY not found in environment variables. " +
    "Falling back to default AWS credential provider chain (shared credentials file, IAM roles, etc.)."
  );
}

const client = new DynamoDBClient(clientConfig);

export const ddbDocClient = DynamoDBDocumentClient.from(client);
