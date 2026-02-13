import { envSchema } from '@film/shared';

export const env = envSchema.parse(process.env);
