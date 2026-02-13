import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['packages/*/src/**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
  resolve: {
    alias: {
      '@web': path.resolve(__dirname, 'packages/web/src'),
      '@server': path.resolve(__dirname, 'packages/server/src'),
    },
  },
});
