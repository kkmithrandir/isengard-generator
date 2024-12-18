export interface PatternStats {
  pattern: string;
  usageCount: number;
  successRate: number;
  lastUsed: Date;
  matchedSteps: Array<{
    step: string;
    similarity: number;
    success: boolean;
  }>;
}

export class PatternAnalytics {
  private stats = new Map<string, PatternStats>();

  recordMatch(pattern: string, step: string, similarity: number, success: boolean): void {
    const stats = this.stats.get(pattern) ?? {
      pattern,
      usageCount: 0,
      successRate: 1,
      lastUsed: new Date(),
      matchedSteps: []
    };

    stats.usageCount++;
    stats.lastUsed = new Date();
    stats.matchedSteps.push({ step, similarity, success });
    stats.successRate = stats.matchedSteps.filter(m => m.success).length / stats.matchedSteps.length;

    this.stats.set(pattern, stats);
  }

  getStats(): Map<string, PatternStats> {
    return new Map(this.stats);
  }

  getBestPatterns(): PatternStats[] {
    return Array.from(this.stats.values())
      .filter(s => s.usageCount > 5)
      .sort((a, b) => b.successRate - a.successRate);
  }
} 