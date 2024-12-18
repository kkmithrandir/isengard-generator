import { readFileSync } from 'fs';
import path from 'path';
import { config } from '../config/config';
import { Logger } from '../utils/logger';

interface TrainingPattern {
  gherkin: string;
  playwright: string;
}

export class PatternMatcher {
  private patterns: TrainingPattern[] = [];
  private config = config.patterns;

  constructor() {
    this.loadPatterns();
    this.validatePatterns();
  }

  private loadPatterns() {
    const trainDataPath = path.join(__dirname, '../../data/train_data.json');
    this.patterns = JSON.parse(readFileSync(trainDataPath, 'utf-8'));
  }

  private validatePatterns(): void {
    for (const pattern of this.patterns) {
      if (!pattern.gherkin || !pattern.playwright) {
        throw new Error(`Invalid pattern: ${JSON.stringify(pattern)}`);
      }
      if (!this.isValidPlaywrightCode(pattern.playwright)) {
        throw new Error(`Invalid Playwright code in pattern: ${pattern.playwright}`);
      }
    }
  }

  private isValidPlaywrightCode(code: string): boolean {
    const validCommands = [
      'page.goto',
      'page.click',
      'page.fill',
      'page.hover',
      'page.check',
      'page.uncheck',
      'page.selectOption',
      'page.press',
      'page.type',
      'page.waitForSelector',
      'page.waitForTimeout',
      'page.setInputFiles',
      'page.dragAndDrop',
      'page.keyboard',
      'expect(page)',
      'expect',
      'page.locator'
    ];

    // Check if the code contains at least one valid command
    return validCommands.some(cmd => code.includes(cmd)) || 
      // Allow any page method calls
      /page\.[a-zA-Z]+/.test(code);
  }

  findMatchingPattern(step: string): TrainingPattern | null {
    Logger.debug(`Finding pattern for step: ${step}`);
    // Normalize step by removing Given/When/Then/And and converting to lowercase
    const normalizedStep = this.normalizeStep(step);

    // First try exact match
    const exactMatch = this.patterns.find(p => 
      this.normalizeStep(p.gherkin) === normalizedStep
    );
    if (exactMatch) return exactMatch;

    // Try fuzzy matching if no exact match
    const bestMatch = this.patterns
      .map(pattern => ({
        pattern,
        similarity: this.calculateSimilarity(normalizedStep, this.normalizeStep(pattern.gherkin))
      }))
      .filter(match => match.similarity >= this.config.similarityThreshold)
      .sort((a, b) => b.similarity - a.similarity)[0];

    return bestMatch ? bestMatch.pattern : null;
  }

  private normalizeStep(step: string): string {
    return step
      .replace(/^(Given|When|Then|And)\s+/i, '')
      .toLowerCase()
      .trim();
  }

  private calculateSimilarity(step1: string, step2: string): number {
    // Temporarily adjust threshold for navigation patterns
    const threshold = (step1.includes('navigate') || step2.includes('navigate')) 
      ? 0.6 
      : this.config.navigationThreshold;
    
    // Handle parameterized steps
    const parameterizedStep1 = this.parameterizeStep(step1);
    const parameterizedStep2 = this.parameterizeStep(step2);

    if (parameterizedStep1 === parameterizedStep2) return 1;

    // Calculate word-based similarity
    const words1 = parameterizedStep1.split(' ');
    const words2 = parameterizedStep2.split(' ');
    
    let matches = 0;
    const usedIndices = new Set<number>();

    words1.forEach(word1 => {
      for (let i = 0; i < words2.length; i++) {
        if (!usedIndices.has(i) && this.wordSimilarity(word1, words2[i]) > 0.8) {
          matches++;
          usedIndices.add(i);
          break;
        }
      }
    });

    return matches / Math.max(words1.length, words2.length);
  }

  private parameterizeStep(step: string): string {
    // Replace quoted values with placeholders
    return step.replace(/"[^"]+"/g, '"{param}"');
  }

  private wordSimilarity(word1: string, word2: string): number {
    if (word1 === word2) return 1;
    if (word1.includes(word2) || word2.includes(word1)) return 0.9;
    return this.levenshteinDistance(word1, word2);
  }

  private levenshteinDistance(s1: string, s2: string): number {
    const track = Array(s2.length + 1).fill(null).map(() =>
      Array(s1.length + 1).fill(null));
    
    for (let i = 0; i <= s1.length; i += 1) {
      track[0][i] = i;
    }
    for (let j = 0; j <= s2.length; j += 1) {
      track[j][0] = j;
    }

    for (let j = 1; j <= s2.length; j += 1) {
      for (let i = 1; i <= s1.length; i += 1) {
        const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        );
      }
    }

    return 1 - (track[s2.length][s1.length] / Math.max(s1.length, s2.length));
  }
} 