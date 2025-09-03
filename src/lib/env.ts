import { z } from "zod";

const envSchema = z.object({
  // Server-side environment variables
  DATABASE_URL: z.string().startsWith("postgresql://"),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  ARCJET_KEY: z.string().min(1),

  // Cloudflare R2 Configuration
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
  R2_ENDPOINT_URL: z.string().url(),
  R2_REGION: z.string().min(1),

  // Legacy AWS/Tigris Configuration (for backward compatibility)
  AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
  AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  AWS_ENDPOINT_URL_S3: z.string().min(1).optional(),
  AWS_ENDPOINT_URL_IAM: z.string().min(1).optional(),
  AWS_REGION: z.string().min(1).optional(),

  // Client-side environment variables
  NEXT_PUBLIC_R2_BUCKET_NAME: z.string().min(1),
  NEXT_PUBLIC_R2_DEV_URL: z.string().url().optional(),
  NEXT_PUBLIC_AWS_S3_BUCKET_NAME: z.string().min(1).optional(),
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

  // Cloudflare R2 Configuration
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME || "kudondza",
  R2_ENDPOINT_URL: process.env.R2_ENDPOINT_URL,
  R2_REGION: process.env.R2_REGION || "auto",

  // Legacy AWS/Tigris Configuration
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_ENDPOINT_URL_S3: process.env.AWS_ENDPOINT_URL_S3,
  AWS_ENDPOINT_URL_IAM: process.env.AWS_ENDPOINT_URL_IAM,
  AWS_REGION: process.env.AWS_REGION,

  // Client-side
  NEXT_PUBLIC_R2_BUCKET_NAME:
    process.env.NEXT_PUBLIC_R2_BUCKET_NAME || "kudondza",
  NEXT_PUBLIC_R2_DEV_URL:
    process.env.NEXT_PUBLIC_R2_DEV_URL ||
    "https://pub-8c05bd36a6e2402b86f528ea4bca59fe.r2.dev",
  NEXT_PUBLIC_AWS_S3_BUCKET_NAME: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
});
