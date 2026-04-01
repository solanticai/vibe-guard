import { describe, it, expect } from 'vitest';
import { testCoverage } from '../../../src/rules/quality/test-coverage.js';
import type { HookContext } from '../../../src/types.js';

function ctx(filePath: string): HookContext {
  return {
    event: 'PreToolUse',
    tool: 'Write',
    toolInput: { file_path: filePath, content: 'export const foo = 1;' },
    projectConfig: { presets: [], agents: ['claude-code'], rules: new Map() },
    gitContext: {
      branch: 'feat/test',
      isDirty: false,
      repoRoot: '/p',
      unpushedCount: 0,
      hasRemote: false,
    },
  };
}

describe('quality/test-coverage', () => {
  it('should pass for test files themselves', () => {
    const r = testCoverage.check(ctx('/p/tests/foo.test.ts'));
    expect(r.status).toBe('pass');
  });

  it('should pass for index files', () => {
    const r = testCoverage.check(ctx('/p/src/index.ts'));
    expect(r.status).toBe('pass');
  });

  it('should pass for config files', () => {
    const r = testCoverage.check(ctx('/p/vitest.config.ts'));
    expect(r.status).toBe('pass');
  });

  it('should pass for type declaration files', () => {
    const r = testCoverage.check(ctx('/p/src/types.d.ts'));
    expect(r.status).toBe('pass');
  });

  it('should pass for non-TS/JS files', () => {
    const r = testCoverage.check(ctx('/p/src/styles.css'));
    expect(r.status).toBe('pass');
  });

  it('should pass for files in tests directory', () => {
    const r = testCoverage.check(ctx('/p/tests/helpers/mock.ts'));
    expect(r.status).toBe('pass');
  });

  it('should warn for source files without tests (when test does not exist)', () => {
    // This will warn because the file path doesn't have a real test file on disk
    const r = testCoverage.check(ctx('/p/src/nonexistent-module.ts'));
    expect(r.status).toBe('warn');
    expect(r.message).toContain('No test file');
  });

  it('should pass for empty file path', () => {
    const r = testCoverage.check(ctx(''));
    expect(r.status).toBe('pass');
  });
});
