/** Result from a single analyzer */
export interface AnalyzerResult {
  analyzer: string;
  patterns: DiscoveredPattern[];
  filesAnalyzed: number;
}

/** A pattern discovered during convention learning */
export interface DiscoveredPattern {
  /** Pattern category */
  type: 'import' | 'naming' | 'structure';
  /** Human-readable description */
  description: string;
  /** How confident we are (0-1) */
  confidence: number;
  /** Number of files exhibiting this pattern */
  occurrences: number;
  /** Total files checked for this pattern */
  totalFiles: number;
  /** Example file paths demonstrating the pattern */
  examples: string[];
  /** Can this be promoted to a rule? */
  promotable: boolean;
  /** If promotable, suggested rule configuration */
  suggestedRule?: {
    ruleId: string;
    config: Record<string, unknown>;
  };
}
