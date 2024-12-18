import fs from 'fs';
import path from 'path';

interface TrainData {
  gherkin: string;
  playwright: string;
}

interface TestResult {
  pattern: string;
  passed: boolean;
  failedCases: Array<{
    input: string;
    expected: string;
    actual: string;
  }>;
}

export class PatternTester {
  private learnedPatterns: Map<string, string> = new Map();

  async initialize(): Promise<void> {
    // Load and learn from train_data.json
    const trainDataPath = path.join(__dirname, '../../data/train_data.json');
    const trainData: TrainData[] = JSON.parse(
      await fs.promises.readFile(trainDataPath, 'utf-8')
    );

    trainData.forEach(({ gherkin, playwright }) => {
      const pattern = this.createPattern(gherkin);
      this.learnedPatterns.set(pattern, playwright);
    });

    console.log(`Learned ${this.learnedPatterns.size} patterns from training data`);
  }

  private createPattern(step: string): string {
    return step
      .replace(/^(Given|When|Then|And)\s+/i, '')
      .replace(/"([^"]+)"/g, (_, value) => {
        // Identify value type
        if (value.match(/^https?:\/\//)) return '{url}';
        if (value.match(/\.(com|org|net)/)) return '{url}';
        if (value.match(/^\d+$/)) return '{number}';
        if (value.match(/button|link|tab/i)) return '{element}';
        return '{text}';
      })
      .toLowerCase();
  }

  private extractValue(pattern: string, input: string): string {
    // Extract quoted values
    const quotedMatch = input.match(/"([^"]+)"/);
    if (quotedMatch) return quotedMatch[1];

    // Extract based on pattern structure
    const patternParts = pattern.split(/\{[^}]+\}/);
    let value = input;
    
    patternParts.forEach(part => {
      const trimmedPart = part.trim();
      if (trimmedPart) {
        const regex = new RegExp(`^${trimmedPart}\\s*|\\s*${trimmedPart}$`, 'gi');
        value = value.replace(regex, '');
      }
    });

    return value.trim();
  }

  async generateTestCases(pattern: string): Promise<Array<{ input: string; expected: string }>> {
    // First check learned patterns
    const normalizedPattern = this.createPattern(pattern);
    const learnedCode = this.learnedPatterns.get(normalizedPattern);
    
    if (learnedCode) {
      // Generate test case based on learned pattern
      return [{
        input: pattern,
        expected: this.adaptLearnedCode(learnedCode, pattern)
      }];
    }

    // Fallback to basic patterns
    const basePattern = pattern.replace(/\{[^}]+\}/g, '{}');
    
    switch (basePattern) {
      case 'I navigate to {}':
      case 'navigate to {}':
        return [
          {
            input: pattern.replace(/\{[^}]+\}/g, 'google.com'),
            expected: 'await page.goto("https://google.com");'
          }
        ];
      default:
        return [
          {
            input: pattern,
            expected: `// TODO: Implement step: ${pattern}`
          }
        ];
    }
  }

  private async generateCode(pattern: string, code: string, input: string): Promise<string> {
    // First try to use learned patterns
    const normalizedPattern = this.createPattern(input);
    const learnedCode = this.learnedPatterns.get(normalizedPattern);
    
    if (learnedCode) {
      return this.adaptLearnedCode(learnedCode, input);
    }

    // Extract value from input
    const value = this.extractValue(pattern, input);
    
    // Handle different code patterns
    if (code.includes('goto')) {
      return `await page.goto("${value.startsWith('http') ? value : 'https://' + value}");`;
    }
    if (code.includes('click')) {
      return `await page.click('button:has-text("${value}")');`;
    }
    if (code.includes('toHaveTitle')) {
      return `await expect(page).toHaveTitle('${value}');`;
    }
    
    // Default replacement
    return code.replace(/\{[^}]+\}/g, value);
  }

  private adaptLearnedCode(code: string, pattern: string): string {
    // Extract value from pattern
    const value = pattern.match(/"([^"]+)"/)?.[ 1] || '';
    
    // Handle different code patterns
    if (code.includes('goto')) {
      return `await page.goto("${value.startsWith('http') ? value : 'https://' + value}");`;
    }
    if (code.includes('click')) {
      return `await page.click('button:has-text("${value}")');`;
    }
    if (code.includes('toHaveTitle')) {
      return `await expect(page).toHaveTitle('${value}');`;
    }
    
    // Default replacement
    return code.replace(/["']([^"']+)["']/, `"${value}"`);
  }

  private isCodeEquivalent(actual: string, expected: string): boolean {
    const normalize = (code: string): string => {
      return code
        .replace(/\s+/g, ' ')
        .replace(/['"]/g, '"')
        .replace(/https?:\/\//g, 'https://') // Normalize URLs
        .trim();
    };

    const normalizedActual = normalize(actual);
    const normalizedExpected = normalize(expected);
    
    console.log('Comparing:', {
      actual: normalizedActual,
      expected: normalizedExpected
    });

    return normalizedActual === normalizedExpected;
  }

  async testPattern(
    pattern: string,
    code: string,
    testCases: Array<{ input: string; expected: string }>
  ): Promise<TestResult> {
    const failedCases: TestResult['failedCases'] = [];

    for (const testCase of testCases) {
      try {
        const generatedCode = await this.generateCode(pattern, code, testCase.input);
        // Compare code structure, not exact string match
        if (!this.isCodeEquivalent(generatedCode, testCase.expected)) {
          failedCases.push({
            input: testCase.input,
            expected: testCase.expected,
            actual: generatedCode
          });
        }
      } catch (error) {
        failedCases.push({
          input: testCase.input,
          expected: testCase.expected,
          actual: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return {
      pattern,
      passed: failedCases.length === 0,
      failedCases
    };
  }
} 