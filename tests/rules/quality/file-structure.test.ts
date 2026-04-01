import { describe, it, expect } from 'vitest';
import { fileStructure } from '../../../src/rules/quality/file-structure.js';
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
      file_path: '/project/src/components/Button.tsx',
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

describe('quality/file-structure', () => {
  // Component placement tests
  it('should pass when a component is in /components/', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/components/Button.tsx',
        content: 'export function Button() { return <button>Click</button>; }',
      },
    });
    const result = fileStructure.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should pass when a component is in /_components/', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/app/dashboard/_components/Sidebar.tsx',
        content: 'export function Sidebar() { return <nav>sidebar</nav>; }',
      },
    });
    const result = fileStructure.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should pass when a component is in /app/ (Next.js)', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/app/page.tsx',
        content: 'export default function Page() { return <div>page</div>; }',
      },
    });
    const result = fileStructure.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should pass when a component is in /pages/', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/pages/index.tsx',
        content: 'export default function Home() { return <div>home</div>; }',
      },
    });
    const result = fileStructure.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should warn when a component is outside standard directories', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/utils/MyWidget.tsx',
        content: 'export function MyWidget() { return <div>widget</div>; }',
      },
    });
    const result = fileStructure.check(ctx);
    expect(result).toHaveProperty('status', 'warn');
    expect(result.message).toContain('component');
    expect(result.fix).toContain('/components/');
  });

  // Hook placement tests
  it('should pass when a hook is in /hooks/', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/hooks/useAuth.ts',
        content: 'export function useAuth() { return { user: null }; }',
      },
    });
    const result = fileStructure.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should pass when a hook is in /_hooks/', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/app/_hooks/useTheme.ts',
        content: 'export function useTheme() { return "light"; }',
      },
    });
    const result = fileStructure.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should warn when a hook is outside hook directories', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/utils/useDebounce.ts',
        content: 'export function useDebounce(value: string) { return value; }',
      },
    });
    const result = fileStructure.check(ctx);
    expect(result).toHaveProperty('status', 'warn');
    expect(result.message).toContain('hook');
    expect(result.fix).toContain('/hooks/');
  });

  // Non-component/non-hook files
  it('should pass for regular utility files', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/utils/helpers.ts',
        content: 'export function formatDate(date: Date) { return date.toISOString(); }',
      },
    });
    const result = fileStructure.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should pass for non-JS/TS files', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/styles/globals.css',
        content: 'body { margin: 0; }',
      },
    });
    const result = fileStructure.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should pass when content is empty', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/components/Empty.tsx',
        content: '',
      },
    });
    const result = fileStructure.check(ctx);
    expect(result).toHaveProperty('status', 'pass');
  });

  it('should detect const-exported components', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/utils/Card.tsx',
        content: 'export const Card = () => <div>card</div>;',
      },
    });
    const result = fileStructure.check(ctx);
    expect(result).toHaveProperty('status', 'warn');
  });

  it('should detect const-exported hooks', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/utils/useCounter.ts',
        content: 'export const useCounter = () => { let c = 0; return c; };',
      },
    });
    const result = fileStructure.check(ctx);
    expect(result).toHaveProperty('status', 'warn');
    expect(result.message).toContain('hook');
  });

  // Hook takes precedence over component check
  it('should check hook placement for useXxx hooks in .tsx files (hook takes precedence)', () => {
    const ctx = createContext({
      toolInput: {
        file_path: '/project/src/components/useFormState.tsx',
        content: 'export function useFormState() { return {}; }',
      },
    });
    // A hook in /components/ should warn about hook placement, not pass as component
    const result = fileStructure.check(ctx);
    // The rule checks isHook separately from isComponent
    // Hook in /components/ (not /hooks/) should warn
    expect(result).toHaveProperty('status', 'warn');
    expect(result.message).toContain('hook');
  });
});
