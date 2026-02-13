import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  WS_PORT: z.coerce.number().default(4001),
  API_URL: z.string().url().default('http://localhost:4000'),
  WS_URL: z.string().default('ws://localhost:4001'),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  S3_ENDPOINT: z.string().default('http://localhost:9000'),
  S3_ACCESS_KEY: z.string().default('minioadmin'),
  S3_SECRET_KEY: z.string().default('minioadmin'),
  S3_BUCKET: z.string().default('film-saas'),
  STRIPE_SECRET_KEY: z.string().default('sk_test_placeholder'),
  STRIPE_WEBHOOK_SECRET: z.string().default('whsec_placeholder'),
  STRIPE_PRICE_PRO: z.string().default('price_placeholder'),
  STRIPE_PRICE_STUDIO: z.string().default('price_placeholder'),
  JWT_SECRET: z.string().min(8).default('change-me-in-production'),
  GIT_SHA: z.string().default('dev'),
});

export type EnvConfig = z.infer<typeof envSchema>;
