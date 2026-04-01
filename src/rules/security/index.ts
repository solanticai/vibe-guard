import type { Rule } from '../../types.js';
import { branchProtection } from './branch-protection.js';
import { destructiveCommands } from './destructive-commands.js';
import { secretDetection } from './secret-detection.js';
import { promptInjection } from './prompt-injection.js';
import { dependencyAudit } from './dependency-audit.js';

export const securityRules: Rule[] = [
  branchProtection,
  destructiveCommands,
  secretDetection,
  promptInjection,
  dependencyAudit,
];

export { branchProtection, destructiveCommands, secretDetection, promptInjection, dependencyAudit };
