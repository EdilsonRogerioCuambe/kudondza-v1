import { z } from "zod";

const envSchema = z.object({
  // Server-side environment variables
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  ARCJET_KEY: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_ENDPOINT_URL_S3: z.string().min(1),
  AWS_ENDPOINT_URL_IAM: z.string().min(1),
  AWS_REGION: z.string().min(1),

  // Client-side environment variables
  NEXT_PUBLIC_AWS_S3_BUCKET_NAME: z.string().min(1),
});

export const env = envSchema.parse({
  // Server-side
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  ARCJET_KEY: process.env.ARCJET_KEY,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_ENDPOINT_URL_S3: process.env.AWS_ENDPOINT_URL_S3,
  AWS_ENDPOINT_URL_IAM: process.env.AWS_ENDPOINT_URL_IAM,
  AWS_REGION: process.env.AWS_REGION,

  // Client-side
  NEXT_PUBLIC_AWS_S3_BUCKET_NAME:
    process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || "kudondza",
});
