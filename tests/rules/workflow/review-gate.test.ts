import { describe, it, expect } from 'vitest';
import { reviewGate } from '../../../src/rules/workflow/review-gate.js';
import type { HookContext, GitContext } from '../../../src/types.js';

function ctx(git: Partial<GitContext>): HookContext {
  return {
    event: 'Stop',
    tool: '',
    toolInput: {},
    projectConfig: { presets: [], agents: ['claude-code'], rules: new Map() },
    gitContext: {
      branch: 'main',
      isDirty: false,
      repoRoot: '/project',
      unpushedCount: 0,
      hasRemote: true,
      ...git,
    },
  };
}

describe('workflow/review-gate', () => {
  it('should pass on feature branches', () => {
    const r = reviewGate.check(ctx({ branch: 'feat/my-feature' }));
    expect(r.status).toBe('pass');
  });

  it('should warn on unpushed commits to main', () => {
    const r = reviewGate.check(ctx({ branch: 'main', unpushedCount: 2 }));
    expect(r.status).toBe('warn');
    expect(r.message).toContain('2 commits');
    expect(r.message).toContain('main');
  });

  it('should warn on dirty working tree on main', () => {
    const r = reviewGate.check(ctx({ branch: 'main', isDirty: true }));
    expect(r.status).toBe('warn');
    expect(r.message).toContain('Uncommitted');
  });

  it('should warn on master branch too', () => {
    const r = reviewGate.check(ctx({ branch: 'master', unpushedCount: 1 }));
    expect(r.status).toBe('warn');
  });

  it('should pass when main is clean', () => {
    const r = reviewGate.check(ctx({ branch: 'main', unpushedCount: 0, isDirty: false }));
    expect(r.status).toBe('pass');
  });

  it('should pass when not in a git repo', () => {
    const r = reviewGate.check(ctx({ branch: null, repoRoot: null }));
    expect(r.status).toBe('pass');
  });

  it('should include fix suggestion', () => {
    const r = reviewGate.check(ctx({ branch: 'main', unpushedCount: 1 }));
    expect(r.fix).toContain('feature branch');
  });
});
