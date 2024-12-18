// src/aiMapper.ts
import { StepHandler } from './utils/stepHandler';
import { GherkinError } from './utils/errorHandler';

export class AIMapper {
  private stepHandler: StepHandler;

  constructor() {
    this.stepHandler = new StepHandler();
  }

  async generatePlaywrightCode(gherkinStep: string): Promise<string> {
    if (!gherkinStep?.trim()) {
      throw new GherkinError('Empty or invalid Gherkin step', gherkinStep);
    }

    try {
      return this.stepHandler.generatePlaywrightCode(gherkinStep);
    } catch (error) {
      throw new GherkinError('Error generating Playwright code', gherkinStep);
    }
  }
}

