import { envSchema } from './env';

const validEnv = {
  NODE_ENV: 'production',
  PORT: 3000,
  WS_PORT: 3001,
  API_URL: 'https://api.example.com',
  WS_URL: 'wss://ws.example.com',
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/filmdb',
  REDIS_URL: 'redis://localhost:6379',
  S3_ENDPOINT: 'https://s3.amazonaws.com',
  S3_ACCESS_KEY: 'AKIAIOSFODNN7EXAMPLE',
  S3_SECRET_KEY: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  S3_BUCKET: 'my-bucket',
  STRIPE_SECRET_KEY: 'sk_live_abc123',
  STRIPE_WEBHOOK_SECRET: 'whsec_abc123',
  STRIPE_PRICE_PRO: 'price_pro123',
  STRIPE_PRICE_STUDIO: 'price_studio123',
  JWT_SECRET: 'super-secret-jwt-key',
  GIT_SHA: 'abc123def',
};

describe('envSchema', () => {
  it('parses valid complete env', () => {
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.NODE_ENV).toBe('production');
      expect(result.data.PORT).toBe(3000);
      expect(result.data.DATABASE_URL).toBe(validEnv.DATABASE_URL);
    }
  });

  it('applies defaults for optional fields', () => {
    const result = envSchema.safeParse({
      DATABASE_URL: 'postgresql://localhost:5432/filmdb',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.NODE_ENV).toBe('development');
      expect(result.data.PORT).toBe(4000);
      expect(result.data.WS_PORT).toBe(4001);
      expect(result.data.API_URL).toBe('http://localhost:4000');
      expect(result.data.WS_URL).toBe('ws://localhost:4001');
      expect(result.data.REDIS_URL).toBe('redis://localhost:6379');
      expect(result.data.S3_BUCKET).toBe('film-saas');
      expect(result.data.JWT_SECRET).toBe('change-me-in-production');
      expect(result.data.GIT_SHA).toBe('dev');
    }
  });

  it('rejects missing DATABASE_URL', () => {
    const result = envSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const dbIssue = result.error.issues.find(
        (issue) => issue.path[0] === 'DATABASE_URL',
      );
      expect(dbIssue).toBeDefined();
    }
  });

  it('coerces PORT string to number', () => {
    const result = envSchema.safeParse({
      DATABASE_URL: 'postgresql://localhost:5432/filmdb',
      PORT: '8080',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(8080);
      expect(typeof result.data.PORT).toBe('number');
    }
  });

  it('validates NODE_ENV enum values', () => {
    const validValues = ['development', 'production', 'test'] as const;
    for (const val of validValues) {
      const result = envSchema.safeParse({
        DATABASE_URL: 'postgresql://localhost:5432/filmdb',
        NODE_ENV: val,
      });
      expect(result.success).toBe(true);
    }

    const invalid = envSchema.safeParse({
      DATABASE_URL: 'postgresql://localhost:5432/filmdb',
      NODE_ENV: 'staging',
    });
    expect(invalid.success).toBe(false);
  });

  it('rejects invalid API_URL', () => {
    const result = envSchema.safeParse({
      DATABASE_URL: 'postgresql://localhost:5432/filmdb',
      API_URL: 'not-a-url',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const apiIssue = result.error.issues.find(
        (issue) => issue.path[0] === 'API_URL',
      );
      expect(apiIssue).toBeDefined();
    }
  });

  it('enforces JWT_SECRET minimum length of 8', () => {
    const tooShort = envSchema.safeParse({
      DATABASE_URL: 'postgresql://localhost:5432/filmdb',
      JWT_SECRET: 'short',
    });
    expect(tooShort.success).toBe(false);
    if (!tooShort.success) {
      const jwtIssue = tooShort.error.issues.find(
        (issue) => issue.path[0] === 'JWT_SECRET',
      );
      expect(jwtIssue).toBeDefined();
    }

    const longEnough = envSchema.safeParse({
      DATABASE_URL: 'postgresql://localhost:5432/filmdb',
      JWT_SECRET: 'exactly8',
    });
    expect(longEnough.success).toBe(true);
  });
});
