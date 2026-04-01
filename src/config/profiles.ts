/**
 * Rule profiles — pre-built severity configurations for different contexts.
 *
 * Profiles are syntactic sugar for bulk severity overrides. They don't
 * disable rules — they adjust severity levels so teams can adopt gradually.
 */

export type ProfileName = 'strict' | 'standard' | 'relaxed' | 'audit';

interface ProfileDefinition {
  name: ProfileName;
  description: string;
  /** Default severity for security rules */
  security: 'block' | 'warn' | 'info';
  /** Default severity for quality rules */
  quality: 'block' | 'warn' | 'info';
  /** Default severity for workflow rules */
  workflow: 'block' | 'warn' | 'info';
}

const PROFILES: Record<ProfileName, ProfileDefinition> = {
  strict: {
    name: 'strict',
    description: 'Everything blocks — for CI and pre-merge checks',
    security: 'block',
    quality: 'block',
    workflow: 'block',
  },
  standard: {
    name: 'standard',
    description: 'Security blocks, quality warns — the default',
    security: 'block',
    quality: 'warn',
    workflow: 'warn',
  },
  relaxed: {
    name: 'relaxed',
    description: 'Security blocks only — for prototyping',
    security: 'block',
    quality: 'info',
    workflow: 'info',
  },
  audit: {
    name: 'audit',
    description: 'Everything is info — collect data without blocking',
    security: 'info',
    quality: 'info',
    workflow: 'info',
  },
};

/**
 * Get the severity override for a rule based on the active profile.
 * Returns null if no profile is set.
 */
export function getProfileSeverity(
  profile: ProfileName,
  ruleId: string,
): 'block' | 'warn' | 'info' {
  const def = PROFILES[profile];
  const category = ruleId.split('/')[0] as 'security' | 'quality' | 'workflow';
  return def[category] ?? def.quality; // fallback to quality for unknown categories
}

export function isValidProfile(name: string): name is ProfileName {
  return name in PROFILES;
}

export function getProfileDescription(name: ProfileName): string {
  return PROFILES[name].description;
}

export const ALL_PROFILES = Object.keys(PROFILES) as ProfileName[];
