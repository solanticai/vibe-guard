---
title: Workflow Rules
description: Rules that enforce development workflow conventions.
---

## workflow/commit-conventions
**Severity:** warn | **Event:** Stop

Validates the most recent commit follows conventional commit format: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

## workflow/pr-reminder
**Severity:** info | **Event:** Stop

At session end, checks for uncommitted or unpushed work and suggests next steps.

## workflow/migration-safety
**Severity:** warn | **Event:** PreToolUse | **Tools:** Write

Warns about dangerous SQL patterns in `.sql` files:
- `DROP TABLE` without `IF EXISTS`
- `DELETE` without `WHERE`
- `TRUNCATE TABLE`
- `UPDATE` without `WHERE`
- Hardcoded UUIDs
- Missing migration header comments

## workflow/review-gate
**Severity:** warn | **Event:** Stop

Warns when commits are made directly to `main` or `master` without a pull request. Suggests creating a feature branch.
