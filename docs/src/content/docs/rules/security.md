---
title: Security Rules
description: Rules that protect against dangerous operations and secrets.
---

## security/branch-protection

**Severity:** block | **Event:** PreToolUse | **Tools:** Edit, Write

Blocks writes to protected branches (main, master by default).

```typescript
rules: {
  'security/branch-protection': {
    protectedBranches: ['main', 'master', 'staging'],
  },
}
```

## security/destructive-commands

**Severity:** block | **Event:** PreToolUse | **Tools:** Bash

Blocks: `rm -rf /`, `rm -rf ~`, `git push --force`, `git push -f`, `git reset --hard`, `git clean -fd`, `curl | sh`, `chmod 777`, `dd of=/dev/`.

## security/secret-detection

**Severity:** block | **Event:** PreToolUse | **Tools:** Write

Detects: AWS keys, GitHub tokens, Stripe keys, private keys, npm tokens, generic API keys/passwords.

```typescript
rules: {
  'security/secret-detection': {
    allowPatterns: ['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
  },
}
```

## security/prompt-injection

**Severity:** warn | **Event:** PostToolUse | **Tools:** Read, Fetch

Detects prompt injection patterns in content read or fetched by the AI agent: instruction overrides, role reassignment, chat template injection.

## security/dependency-audit

**Severity:** warn | **Event:** PostToolUse | **Tools:** Bash

Flags suspicious package installation patterns: installing from URLs instead of registry, pip over HTTP, curl piped to pip.
