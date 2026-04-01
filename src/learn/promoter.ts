import type { DiscoveredPattern } from './analyzers/types.js';

/** A rule configuration suggested from a discovered pattern */
export interface PromotionSuggestion {
  ruleId: string;
  config: Record<string, unknown>;
  reason: string;
  confidence: number;
}

/**
 * Filter promotable patterns and generate rule configuration suggestions.
 * Only suggests patterns with confidence >= threshold.
 */
export function getPromotionSuggestions(
  patterns: DiscoveredPattern[],
  confidenceThreshold = 0.7,
): PromotionSuggestion[] {
  return patterns
    .filter((p) => p.promotable && p.suggestedRule && p.confidence >= confidenceThreshold)
    .map((p) => ({
      ruleId: p.suggestedRule!.ruleId,
      config: p.suggestedRule!.config,
      reason: p.description,
      confidence: p.confidence,
    }));
}

/**
 * Merge promotion suggestions into a vibecheck config rules object.
 * Deduplicates by ruleId and merges configs.
 */
export function mergePromotions(
  suggestions: PromotionSuggestion[],
): Record<string, Record<string, unknown>> {
  const merged: Record<string, Record<string, unknown>> = {};

  for (const suggestion of suggestions) {
    if (!merged[suggestion.ruleId]) {
      merged[suggestion.ruleId] = {};
    }
    Object.assign(merged[suggestion.ruleId], suggestion.config);
  }

  return merged;
}
