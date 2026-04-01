import { describe, it, expect } from 'vitest';
import { noConsoleLog } from '../../../src/rules/quality/no-console-log.js';
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
      file_path: '/project/src/utils/helpers.ts',
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

describe('quality/no-console-log', () => {
  it('should pass when no console.log is present', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/utils/math.ts',
        content: 'export function add(a: number, b: number) { return a + b; }',
      },
    });
    const result = noConsoleLog.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should warn when console.log is found in production code', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/utils/api.ts',
        content: `
          export function fetchData() {
            console.log('fetching data');
            return fetch('/api/data');
          }
        `,
      },
    });
    const result = noConsoleLog.check(ctx);
    expect(result).toHaveProperty('status', 'warn');
    expect(result.message).toContain('console.log');
    expect(result.metadata?.count).toBe(1);
  });

  it('should count multiple console.log statements', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/utils/debug.ts',
        content: `
          console.log('one');
          console.log('two');
          console.log('three');
        `,
      },
    });
    const result = noConsoleLog.check(ctx);
    expect(result).toHaveProperty('status', 'warn');
    expect(result.metadata?.count).toBe(3);
  });

  it('should allow console.log in test files', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/tests/utils/math.test.ts',
        content: `console.log('debugging test');`,
      },
    });
    const result = noConsoleLog.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should allow console.log in .spec files', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/utils/math.spec.ts',
        content: `console.log('spec output');`,
      },
    });
    const result = noConsoleLog.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should allow console.log in scripts/ directory', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/scripts/seed.ts',
        content: `console.log('seeding database');`,
      },
    });
    const result = noConsoleLog.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should not flag console.error or console.warn', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/utils/api.ts',
        content: `
          console.error('something broke');
          console.warn('deprecation warning');
        `,
      },
    });
    const result = noConsoleLog.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should pass for non-JS/TS files', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/styles/globals.css',
        content: 'body { margin: 0; }',
      },
    });
    const result = noConsoleLog.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should pass when content is empty', () => {
    const ctx = createContext({
      toolInput: { file_path: '/project/src/empty.ts', content: '' },
    });
    const result = noConsoleLog.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should include fix suggestion', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/app.ts',
        content: `console.log('hello');`,
      },
    });
    const result = noConsoleLog.check(ctx);
    expect(result.fix).toContain('logger');
  });
});
