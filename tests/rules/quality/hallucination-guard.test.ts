import { describe, it, expect, vi } from 'vitest';
import { hallucinationGuard } from '../../../src/rules/quality/hallucination-guard.js';
import type { HookContext, ResolvedConfig } from '../../../src/types.js';

// Mock fs.existsSync to control which files "exist"
// Normalize to forward slashes and strip drive letters for cross-platform matching
function normForMatch(p: string): string {
  return p.replace(/\\/g, '/').replace(/^[A-Za-z]:/, '');
}

vi.mock('node:fs', async () => {
  const actual = await vi.importActual<typeof import('node:fs')>('node:fs');
  return {
    ...actual,
    existsSync: vi.fn((p: string) => {
      const normalized = normForMatch(p);
      const existing = [
        '/project/src/utils/helpers.ts',
        '/project/src/components/Button.tsx',
        '/project/src/index.ts',
      ];
      return existing.some((e) => normalized === e || normalized.startsWith(e));
    }),
  };
});

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
      file_path: '/project/src/app/page.tsx',
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

describe('quality/hallucination-guard', () => {
  it('should pass when there are no imports', async () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/app/page.tsx',
        content: 'export default function Page() { return <div>Hello</div>; }',
      },
    });
    const result = await hallucinationGuard.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should pass when all relative imports exist', async () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/app/page.tsx',
        content: `
          import { helper } from '../utils/helpers';
          import { Button } from '../components/Button';
        `,
      },
    });
    const result = await hallucinationGuard.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should warn when a relative import references a non-existent file', async () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/app/page.tsx',
        content: `
          import { foo } from '../nonexistent/module';
        `,
      },
    });
    const result = await hallucinationGuard.check(ctx);
    expect(result).toHaveProperty('status', 'warn');
    expect(result.message).toContain('../nonexistent/module');
    expect(result.metadata?.missingImports).toContain('../nonexistent/module');
  });

  it('should ignore non-relative imports (package imports)', async () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/app/page.tsx',
        content: `
          import React from 'react';
          import { z } from 'zod';
        `,
      },
    });
    const result = await hallucinationGuard.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should pass for non-TypeScript/JavaScript files', async () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/README.md',
        content: `import { foo } from '../nonexistent/bar';`,
      },
    });
    const result = await hallucinationGuard.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should pass when content is empty', async () => {
    const ctx = createContext({
      toolInput: { file_path: '/project/src/index.ts', content: '' },
    });
    const result = await hallucinationGuard.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should pass when file_path is empty', async () => {
    const ctx = createContext({
      toolInput: { file_path: '', content: 'import { x } from "./missing"' },
    });
    const result = await hallucinationGuard.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should report multiple missing imports', async () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/app/page.tsx',
        content: `
          import { a } from '../ghost/moduleA';
          import { b } from '../ghost/moduleB';
        `,
      },
    });
    const result = await hallucinationGuard.check(ctx);
    expect(result).toHaveProperty('status', 'warn');
    expect(result.message).toContain('Imports');
    expect(result.message).toContain('files');
    const missing = result.metadata?.missingImports as string[];
    expect(missing).toHaveLength(2);
  });

  it('should include a fix suggestion', async () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/app/page.tsx',
        content: `import { x } from '../phantom/file';`,
      },
    });
    const result = await hallucinationGuard.check(ctx);
    expect(result.fix).toContain('Verify');
  });
});
