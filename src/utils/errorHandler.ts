export class GherkinError extends Error {
  constructor(message: string, public step?: string) {
    super(message);
    this.name = 'GherkinError';
  }
}

export class PlaywrightGenerationError extends Error {
  constructor(message: string, public pattern?: string) {
    super(message);
    this.name = 'PlaywrightGenerationError';
  }
}

export class TestGenerationError extends Error {
  constructor(
    message: string,
    public readonly step?: string,
    public readonly scenario?: string,
    public readonly feature?: string
  ) {
    super(message);
    this.name = 'TestGenerationError';
  }
}

export function handleError(_context: string, error: Error): void {
  if (error instanceof GherkinError) {
    console.error(`Gherkin Error: ${error.message}`, error.step);
  } else if (error instanceof PlaywrightGenerationError) {
    console.error(`Generation Error: ${error.message}`, error.pattern);
  } else if (error instanceof TestGenerationError) {
    console.error(`Test Generation Error: ${error.message}`);
    if (error.step) console.error(`Step: ${error.step}`);
    if (error.scenario) console.error(`Scenario: ${error.scenario}`);
    if (error.feature) console.error(`Feature: ${error.feature}`);
  } else {
    console.error('Unexpected Error:', error);
  }
} 