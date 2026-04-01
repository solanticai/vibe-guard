import type { Rule } from '../../types.js';
import { commitConventions } from './commit-conventions.js';
import { prReminder } from './pr-reminder.js';
import { migrationSafety } from './migration-safety.js';
import { reviewGate } from './review-gate.js';
import { todoTracker } from './todo-tracker.js';

export const workflowRules: Rule[] = [
  commitConventions,
  prReminder,
  migrationSafety,
  reviewGate,
  todoTracker,
];

export { commitConventions, prReminder, migrationSafety, reviewGate, todoTracker };
