import type { Rule, RuleResult } from '../../types.js';

/**
 * workflow/review-gate
 *
 * At session end (Stop event), warns if commits were made directly
 * to a protected branch without a pull request.
 */
export const reviewGate: Rule = {
  id: 'workflow/review-gate',
  name: 'Review Gate',
  description: 'Warns when commits are made directly to main/master without a PR.',
  severity: 'warn',
  events: ['Stop'],
  editCheck: false,

  check: (context): RuleResult => {
    const ruleId = 'workflow/review-gate';
    const { branch, repoRoot, unpushedCount } = context.gitContext;

    if (!repoRoot || !branch) return { status: 'pass', ruleId };

    const protectedBranches = ['main', 'master'];
    const isProtected = protectedBranches.some((pb) => branch.toLowerCase() === pb.toLowerCase());

    if (!isProtected) return { status: 'pass', ruleId };

    // Check if there are new commits on the protected branch
    if (unpushedCount > 0) {
      return {
        status: 'warn',
        ruleId,
        message: `${unpushedCount} commit${unpushedCount > 1 ? 's' : ''} made directly to "${branch}". Use a pull request for code review.`,
        fix: `Create a feature branch and PR: git checkout -b feat/your-change && git push -u origin feat/your-change`,
      };
    }

    // Check if the working tree is dirty on a protected branch
    if (context.gitContext.isDirty) {
      return {
        status: 'warn',
        ruleId,
        message: `Uncommitted changes on "${branch}". Create a feature branch before committing.`,
        fix: `git checkout -b feat/your-change`,
      };
    }

    return { status: 'pass', ruleId };
  },
};
