import { describe, it, expect } from 'vitest';
import { envExposure } from '../../../src/rules/security/env-exposure.js';
import type { HookContext, ResolvedConfig } from '../../../src/types.js';

function createContext(overrides: Partial<HookContext> = {}): HookContext {
  const defaultConfig: ResolvedConfig = {
    presets: [],
    agents: ['claude-code'],
    rules: new Map(),
  };

  return {
    event: 'PreToolUse',
    tool: 'Write',
    toolInput: {
      file_path: '/project/src/components/Dashboard.tsx',
      content: '',
    },
    projectConfig: defaultConfig,
    gitContext: {
      branch: 'feat/test',
      isDirty: false,
      repoRoot: '/project',
      unpushedCount: 0,
      hasRemote: false,
    },
    ...overrides,
  };
}

describe('security/env-exposure', () => {
  it('should pass for normal client-side code', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/components/Button.tsx',
        content: 'export function Button() { return <button>Click</button>; }',
      },
    });
    const result = envExposure.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should block direct .env imports in client code', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/components/Config.tsx',
        content: `import dotenv from '.env';`,
      },
    });
    const result = envExposure.check(ctx);
    expect(result).toHaveProperty('status', 'block');
    expect(result.message).toContain('.env');
  });

  it('should block logging process.env in client code', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/app/page.tsx',
        content: `console.log(process.env.SECRET_KEY);`,
      },
    });
    const result = envExposure.check(ctx);
    expect(result).toHaveProperty('status', 'block');
    expect(result.message).toContain('process.env');
  });

  it('should block spreading process.env', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/components/Config.tsx',
        content: `const config = { ...process.env };`,
      },
    });
    const result = envExposure.check(ctx);
    expect(result).toHaveProperty('status', 'block');
    expect(result.message).toContain('Spreading');
  });

  it('should pass for server-side files (API routes)', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/app/api/auth/route.ts',
        content: `console.log(process.env.SECRET_KEY);`,
      },
    });
    const result = envExposure.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should pass for .server.ts files', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/lib/auth.server.ts',
        content: `console.log(process.env.SECRET_KEY);`,
      },
    });
    const result = envExposure.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should pass for non-client directories', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/lib/database.ts',
        content: `console.log(process.env.DATABASE_URL);`,
      },
    });
    const result = envExposure.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should pass when content is empty', () => {
    const ctx = createContext({
      toolInput: { file_path: '/project/src/components/Empty.tsx', content: '' },
    });
    const result = envExposure.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should include a fix suggestion', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/components/Bad.tsx',
        content: `const config = { ...process.env };`,
      },
    });
    const result = envExposure.check(ctx);
    expect(result.fix).toBeDefined();
  });
});
