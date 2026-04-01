import { describe, it, expect } from 'vitest';
import { todoTracker } from '../../../src/rules/workflow/todo-tracker.js';
import type { HookContext, ResolvedConfig } from '../../../src/types.js';

function createContext(overrides: Partial<HookContext> = {}): HookContext {
  const defaultConfig: ResolvedConfig = {
    presets: [],
    agents: ['claude-code'],
    rules: new Map(),
  };

  return {
    event: 'PostToolUse',
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

describe('workflow/todo-tracker', () => {
  it('should pass when no TODO markers are present', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/utils/clean.ts',
        content: 'export function add(a: number, b: number) { return a + b; }',
      },
    });
    const result = todoTracker.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should warn when TODO is found', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/utils/api.ts',
        content: `
          // TODO: implement error handling
          export function fetchData() { return fetch('/api'); }
        `,
      },
    });
    const result = todoTracker.check(ctx);
    expect(result).toHaveProperty('status', 'warn');
    expect(result.message).toContain('TODO');
  });

  it('should detect FIXME markers', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/utils/broken.ts',
        content: `// FIXME: this crashes on empty arrays`,
      },
    });
    const result = todoTracker.check(ctx);
    expect(result).toHaveProperty('status', 'warn');
    expect(result.message).toContain('FIXME');
  });

  it('should detect HACK markers', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/utils/workaround.ts',
        content: `// HACK: temporary workaround for API bug`,
      },
    });
    const result = todoTracker.check(ctx);
    expect(result).toHaveProperty('status', 'warn');
    expect(result.message).toContain('HACK');
  });

  it('should count multiple markers and categorize them', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/service.ts',
        content: `
          // TODO: add pagination
          // TODO: add sorting
          // FIXME: handle null case
          // HACK: bypass validation for now
        `,
      },
    });
    const result = todoTracker.check(ctx);
    expect(result).toHaveProperty('status', 'warn');
    expect(result.metadata?.count).toBe(4);
    const categories = result.metadata?.categories as Record<string, number>;
    expect(categories.TODO).toBe(2);
    expect(categories.FIXME).toBe(1);
    expect(categories.HACK).toBe(1);
  });

  it('should be case-insensitive', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/code.ts',
        content: `// todo: lowercase marker`,
      },
    });
    const result = todoTracker.check(ctx);
    expect(result).toHaveProperty('status', 'warn');
  });

  it('should pass for non-source files', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/README.md',
        content: '// TODO: this is markdown, not source',
      },
    });
    const result = todoTracker.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should pass when content is empty', () => {
    const ctx = createContext({
      toolInput: { file_path: '/project/src/empty.ts', content: '' },
    });
    const result = todoTracker.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should include a fix suggestion', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/task.ts',
        content: `// TODO: implement this feature`,
      },
    });
    const result = todoTracker.check(ctx);
    expect(result.fix).toContain('TODO');
  });
});
