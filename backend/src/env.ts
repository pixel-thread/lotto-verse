import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    CLERK_SECRET_KEY: z.string("ENV CLERK_SECRET_KEY is missing"),
    DATABASE_URL: z.url("ENV Database url is missing"),
    DIRECT_URL: z.string("ENV DIRECT_URL is missing"),
    RAZORPAY_KEY_ID: z.string("ENV RAZORPAY_KEY_ID is missing"),
    RAZORPAY_KEY_SECRET: z.string("ENV RAZORPAY_KEY_SECRET is missing"),
    RAZORPAY_WEBHOOK_SECRET: z.string("ENV RAZORPAY_WEBHOOK_SECRET is missing"),
    EAS_WEBHOOK_SECRET: z.string("ENV EAS_WEBHOOK_SECRET is missing"),
    CRON_SECRET: z.string("ENV CRON_SECRET is missing"),
  },

  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().min(1),
    NEXT_PUBLIC_BASE_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(
      "ENV CLERK_PUBLISHABLE_KEY is missing",
    ),
    NEXT_PUBLIC_APP_NAME: z.string("ENV APP_NAME is missing"),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
