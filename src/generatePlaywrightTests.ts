// src/generatePlaywrightTests.ts
import parseFeatureFile from './parseGherkin';
import { StepHandler } from './utils/stepHandler';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './utils/logger';


// Add types for any
interface TestStep {
  keyword: string;
  text: string;
  line: number;
}

interface TestScenario {
  name: string;
  steps: TestStep[];
}

// Define directories
const featuresDir = path.resolve(__dirname, '../features');
const generatedTestsDir = path.resolve(__dirname, '../generated-tests');

// Ensure the generated-tests directory exists
if (!fs.existsSync(generatedTestsDir)) {
  fs.mkdirSync(generatedTestsDir);
}

// Function to generate Playwright tests
export async function generatePlaywrightTests(): Promise<void> {
  const stepHandler = new StepHandler();
  
  try {
    const featureFiles = await fs.promises.readdir(featuresDir);
    Logger.info(`🔎 Found ${featureFiles.length} feature files`);
    
    for (const file of featureFiles) {
      if (!file.endsWith('.feature')) continue;
      
      const featurePath = path.join(featuresDir, file);
      const feature = await parseFeatureFile(featurePath);
      
      Logger.feature(feature.name);
      
      for (const scenario of feature.scenarios) {
        Logger.info(`📝 Processing scenario: ${scenario.name}`);
        await processScenario(scenario, feature.name, stepHandler);
      }
    }
    Logger.success('✨ Test generation completed successfully');
  } catch (error) {
    Logger.error('Test generation failed:', error);
    throw error;
  }
}

async function processScenario(
  scenario: TestScenario, 
  featureName: string, 
  stepHandler: StepHandler
): Promise<void> {
  const steps: string[] = [];
  
  for (const step of scenario.steps) {
    const playwrightCode = stepHandler.generatePlaywrightCode(step.text);
    if (playwrightCode) {
      steps.push(playwrightCode);
    }
  }

  const testCode = await generatePlaywrightTest(scenario, steps);
  await writeTestToFile(testCode, featureName, scenario.name);
}

async function generatePlaywrightTest(scenario: TestScenario, steps: string[]): Promise<string> {
  return `
import { test } from '@playwright/test';

test.describe('${scenario.name}', () => {
  test('${scenario.name}', async ({ page }) => {
    ${steps.join('\n    ')}
  });
});`;
}

async function writeTestToFile(content: string, featureName: string, scenarioName: string): Promise<void> {
  const fileName = `${featureName}_${scenarioName.replace(/\s+/g, '_').toLowerCase()}.spec.ts`;
  const filePath = path.join(generatedTestsDir, fileName);
  await fs.promises.writeFile(filePath, content, 'utf-8');
  Logger.file(fileName);
}
