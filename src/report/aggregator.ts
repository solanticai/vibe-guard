import { readRuleHits } from '../engine/tracker.js';
import type { RuleHitRecord } from '../engine/tracker.js';

/** Summary for a single rule's hit data */
export interface RuleHitSummary {
  ruleId: string;
  totalHits: number;
  blocks: number;
  warns: number;
  passes: number;
  lastHit: string;
}

/** Aggregated quality report data */
export interface QualityReportData {
  generatedAt: string;
  totalHits: number;
  ruleHits: RuleHitSummary[];
  blockWarnRatio: { blocks: number; warns: number; passes: number };
  debtScore: number;
}

/**
 * Aggregate rule hit data into a quality report.
 */
export function aggregateReport(projectRoot: string): QualityReportData {
  const records = readRuleHits(projectRoot);

  // Group by rule
  const byRule = new Map<string, RuleHitRecord[]>();
  for (const record of records) {
    const existing = byRule.get(record.ruleId) ?? [];
    existing.push(record);
    byRule.set(record.ruleId, existing);
  }

  // Build summaries
  const ruleHits: RuleHitSummary[] = [];
  let totalBlocks = 0;
  let totalWarns = 0;
  let totalPasses = 0;

  for (const [ruleId, hits] of byRule) {
    const blocks = hits.filter((h) => h.status === 'block').length;
    const warns = hits.filter((h) => h.status === 'warn').length;
    const passes = hits.filter((h) => h.status === 'pass').length;

    totalBlocks += blocks;
    totalWarns += warns;
    totalPasses += passes;

    const lastHit = hits.reduce((latest, h) => (h.timestamp > latest ? h.timestamp : latest), '');

    ruleHits.push({
      ruleId,
      totalHits: hits.length,
      blocks,
      warns,
      passes,
      lastHit,
    });
  }

  // Sort by total hits descending
  ruleHits.sort((a, b) => b.totalHits - a.totalHits);

  // Calculate debt score (0-100, lower is better)
  // Based on block/warn ratio — more blocks = more debt
  const totalIssues = totalBlocks + totalWarns;
  const total = totalIssues + totalPasses;
  const debtScore = total > 0 ? Math.round((totalIssues / total) * 100) : 0;

  return {
    generatedAt: new Date().toISOString(),
    totalHits: records.length,
    ruleHits,
    blockWarnRatio: { blocks: totalBlocks, warns: totalWarns, passes: totalPasses },
    debtScore,
  };
}
