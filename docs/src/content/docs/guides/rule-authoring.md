---
title: Rule Authoring
description: Create a custom VibeCheck rule in 30 minutes.
---

## Rule Structure

```typescript
import type { Rule } from '@solanticai/vibecheck';

export const myRule: Rule = {
  id: 'custom/my-rule',
  name: 'My Rule',
  description: 'What it checks and why',
  severity: 'warn',
  events: ['PreToolUse'],
  match: { tools: ['Write'] },
  check: (context) => {
    const content = (context.toolInput.content as string) ?? '';
    if (/bad_pattern/.test(content)) {
      return {
        status: 'warn',
        ruleId: 'custom/my-rule',
        message: 'Bad pattern detected.',
        fix: 'How to fix it.',
      };
    }
    return { status: 'pass', ruleId: 'custom/my-rule' };
  },
};
```

## Key Concepts

### HookContext
- `event` — PreToolUse, PostToolUse, Stop, etc.
- `tool` — Edit, Write, Bash, Read
- `toolInput` — file_path, content, command, old_string, new_string
- `gitContext` — branch, isDirty, repoRoot

### Edit Rule Factory
Write rules automatically get an Edit variant via `createEditVariant()`. It only flags **newly introduced** patterns — pre-existing issues pass through.

### Severity
- **block** — prevents the operation (exit 2)
- **warn** — allows but warns
- **info** — informational only

## Steps

1. Create `src/rules/{category}/{name}.ts`
2. Implement the `Rule` interface
3. Register in `src/rules/{category}/index.ts`
4. Write tests in `tests/rules/{category}/{name}.test.ts`
5. PR with: `feat(rules): add {category}/{name}`
