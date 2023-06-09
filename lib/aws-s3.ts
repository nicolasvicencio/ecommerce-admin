import { S3Client } from "@aws-sdk/client-s3";

export const client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_SECRET_ACCESS!,
    secretAccessKey: process.env.S3_ACCESS_KEY!,
  },
});
