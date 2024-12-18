export class MetricsCollector {
  private metrics = {
    patternsLearned: 0,
    testsGenerated: 0,
    successfulMatches: 0,
    failedMatches: 0,
    generationTime: 0
  };

  recordGeneration(success: boolean, time: number): void {
    this.metrics.testsGenerated++;
    if (success) this.metrics.successfulMatches++;
    else this.metrics.failedMatches++;
    this.metrics.generationTime += time;
  }

  getReport(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
} 