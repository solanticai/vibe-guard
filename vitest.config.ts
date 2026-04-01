import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      thresholds: {
        lines: 70,
        branches: 65,
        functions: 70,
        statements: 70,
      },
      exclude: ['node_modules/', 'dist/', 'tests/', '**/*.config.*', '**/*.d.ts'],
    },
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/benchmarks/**'],
  },
});
