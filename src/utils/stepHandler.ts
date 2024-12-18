import { readFileSync } from 'fs';
import path from 'path';
import { Logger } from './logger';

interface TrainingPattern {
  gherkin: string;
  playwright: string;
}

export class StepHandler {
  private patterns: TrainingPattern[];

  constructor() {
    const trainDataPath = path.join(__dirname, '../../data/train_data.json');
    this.patterns = JSON.parse(readFileSync(trainDataPath, 'utf-8'));
  }

  findMatchingStep(stepDescription: string): TrainingPattern | null {
    console.log('\nLooking for step:', stepDescription);

    for (const item of this.patterns) {
      // Convert pattern to regex-safe string and handle quoted parameters
      const patternAsRegex = item.gherkin
        // First escape all special regex characters
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        // Then replace {param} with a regex to match quoted strings
        .replace(/\\\{[^}]+\\\}/g, '"([^"]*)"');

      const regex = new RegExp(`^${patternAsRegex}$`, 'i');
      console.log(`Testing pattern: "${item.gherkin}" -> "${patternAsRegex}"`);

      const match = regex.test(stepDescription);
      if (match) {
        console.log('Found matching pattern:', item.gherkin);
        return item;
      }
    }

    // Fallback to simpler matching if exact match fails
    for (const item of this.patterns) {
      const basePattern = item.gherkin
        .replace(/\{[^}]+\}/g, '.*')
        .toLowerCase();
      const normalizedStep = stepDescription.toLowerCase();

      if (normalizedStep === basePattern) {
        console.log('Found fuzzy match:', item.gherkin);
        return item;
      }
    }

    console.log('No matching pattern found');
    return null;
  }

  generatePlaywrightCode(stepDescription: string): string {
    const step = this.findMatchingStep(stepDescription);
    
    if (!step) {
      console.error('Available patterns:', this.patterns.map(p => p.gherkin));
      throw new Error(`Step "${stepDescription}" not found in train_data.json`);
    }

    try {
      const placeholders = stepDescription.match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, ''));
      let playwrightCommand = step.playwright;

      if (placeholders) {
        const paramNames = step.gherkin.match(/\{([^}]+)\}/g)?.map(p => p.replace(/[{}]/g, ''));
        console.log('Replacing:', { placeholders, paramNames });
        
        placeholders.forEach((value, index) => {
          if (paramNames && paramNames[index]) {
            const paramName = paramNames[index];
            console.log(`Replacing {${paramName}} with ${value}`);
            playwrightCommand = playwrightCommand.replace(`{${paramName}}`, value);
          }
        });
      }

      console.log('Generated command:', playwrightCommand);
      Logger.pattern(step.gherkin, playwrightCommand);
      return playwrightCommand;
    } catch (error) {
      console.error('Error generating code:', error);
      throw error;
    }
  }
} 