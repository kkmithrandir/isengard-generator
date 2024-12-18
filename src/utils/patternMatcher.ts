export class PatternMatcher {
  private patterns: Map<string, string>;

  constructor() {
    this.patterns = new Map();
  }

  addPattern(pattern: string, code: string): void {
    this.patterns.set(pattern, code);
  }

  findMatch(step: string): string | null {
    for (const [pattern, code] of this.patterns) {
      if (this.matchesPattern(step, pattern)) {
        return code;
      }
    }
    return null;
  }

  private matchesPattern(step: string, pattern: string): boolean {
    const regex = this.convertToRegex(pattern);
    return regex.test(step);
  }

  private convertToRegex(pattern: string): RegExp {
    const escaped = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\{[^}]+\}/g, '"([^"]*)"');
    return new RegExp(`^${escaped}$`, 'i');
  }
} 