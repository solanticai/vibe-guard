---
title: Rules Overview
description: All built-in VibeCheck rules.
---

VibeCheck ships with **17 built-in rules** across 3 categories.

## Security Rules (5)

| Rule | Severity | Description |
|------|----------|-------------|
| `security/branch-protection` | block | Blocks writes to protected branches |
| `security/destructive-commands` | block | Blocks dangerous shell commands |
| `security/secret-detection` | block | Detects API keys, tokens, passwords |
| `security/prompt-injection` | warn | Detects injection patterns in fetched content |
| `security/dependency-audit` | warn | Flags suspicious package installations |

## Quality Rules (8)

| Rule | Severity | Description |
|------|----------|-------------|
| `quality/import-aliases` | block | Enforces path aliases over deep relative imports |
| `quality/no-use-client-in-pages` | block | No "use client" in Next.js pages/layouts |
| `quality/naming-conventions` | block | PascalCase components, use-prefixed hooks |
| `quality/no-deprecated-api` | block | Catches deprecated API usage |
| `quality/anti-patterns` | warn | CSS in Tailwind, inline styles, console.log |
| `quality/file-structure` | warn | Components/hooks in correct directories |
| `quality/hallucination-guard` | warn | Verifies imports exist on disk |
| `quality/test-coverage` | warn | Warns when files have no tests |

## Workflow Rules (4)

| Rule | Severity | Description |
|------|----------|-------------|
| `workflow/commit-conventions` | warn | Conventional commit format |
| `workflow/pr-reminder` | info | Reminds about unpushed work at session end |
| `workflow/migration-safety` | warn | Dangerous SQL patterns |
| `workflow/review-gate` | warn | Warns on direct commits to main |
