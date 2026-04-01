import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  readCredentials,
  writeCredentials,
  clearCredentials,
  hasValidCredentials,
} from '../../src/cloud/credentials.js';

// Mock the fs module to avoid actual file operations
vi.mock('node:fs', async () => {
  const store = new Map<string, string>();
  return {
    existsSync: vi.fn((p: string) => store.has(p)),
    readFileSync: vi.fn((p: string) => {
      const content = store.get(p);
      if (!content) throw new Error('File not found');
      return content;
    }),
    writeFileSync: vi.fn((p: string, content: string) => {
      store.set(p, content);
    }),
    unlinkSync: vi.fn((p: string) => {
      store.delete(p);
    }),
    mkdirSync: vi.fn(),
  };
});

describe('cloud/credentials', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when no credentials exist', () => {
    const result = readCredentials();
    // First call when store is empty
    expect(result).toBeNull();
  });

  it('should write and read credentials', () => {
    const creds = { accessToken: 'test-token-123', email: 'user@test.com' };
    writeCredentials(creds);
    const result = readCredentials();
    expect(result).toEqual(creds);
  });

  it('should clear credentials', () => {
    writeCredentials({ accessToken: 'token' });
    clearCredentials();
    const result = readCredentials();
    expect(result).toBeNull();
  });

  it('should detect valid credentials', () => {
    writeCredentials({ accessToken: 'valid-token' });
    expect(hasValidCredentials()).toBe(true);
  });

  it('should return true for expired credentials (refresh handles expiry)', () => {
    // hasValidCredentials only checks if a token exists.
    // Expiry is handled by getValidCredentials/refreshAccessToken at call time.
    writeCredentials({
      accessToken: 'expired-token',
      expiresAt: '2020-01-01T00:00:00Z',
    });
    expect(hasValidCredentials()).toBe(true);
  });
});
