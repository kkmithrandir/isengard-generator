// src/generatePlaywrightTests.ts
import { parseFeatureFile, ParsedFeature, ParsedScenario, ParsedStep } from './parseGherkin';
import  {writeFileSync, mkdirSync, existsSync}  from 'fs';
import path from 'path';
import { glob } from 'glob';
import { AIMapper } from './aiMapper';
import { TestValidator } from './utils/testValidator';
import { test, expect, Page } from '@playwright/test';

// Define directories and model path
const featuresDir = path.resolve(__dirname, '../features');
const generatedTestsDir = path.resolve(__dirname, '../generated-tests');

// Ensure the generated-tests directory exists
if (!existsSync(generatedTestsDir)) {
  mkdirSync(generatedTestsDir);
}

// Function to generate Playwright tests
export async function generatePlaywrightTests(): Promise<void> {
  console.log('Starting test generation...');
  
  const aiMapper = new AIMapper();
  const validator = new TestValidator();
  
  console.log('Initializing AI Mapper...');

  console.log('Finding feature files...');
  const featureFiles = await glob(`${featuresDir}/**/*.feature`);
  console.log(`Found ${featureFiles.length} feature files`);
  
  for (const file of featureFiles) {
    console.log(`\nProcessing feature file: ${file}`);
    const parsedFeature = await parseFeatureFile(file);
    
    for (const scenario of parsedFeature.scenarios) {
      console.log(`\nProcessing scenario: ${scenario.title}`);
      let testSteps = '';
      let hasErrors = false;

      for (const step of scenario.steps) {
        try {
          console.log(`Processing step: ${step.text}`);
          const code = await aiMapper.generatePlaywrightCode(step.text);
          
          if (validator.validateGeneratedCode(code)) {
            testSteps += `    ${code}\n`;
          } else {
            console.warn(`Invalid code generated for step: ${step.text}`);
            hasErrors = true;
          }
        } catch (error) {
          console.error(`Error generating code for step: ${step.text}`, error);
          hasErrors = true;
          testSteps += `    // TODO: ${step.text}\n`;
        }
      }

      if (!hasErrors) {
        console.log('Generating test file...');
        const testFile = generateTestFile(parsedFeature, scenario, testSteps);
        const validationErrors = validator.validateTestFile(testFile);
        
        if (validationErrors.length === 0) {
          const featureName = parsedFeature.feature.replace(/\s+/g, '_').toLowerCase();
          const scenarioName = scenario.title.replace(/\s+/g, '_').toLowerCase();
          const testFileName = `${featureName}_${scenarioName}.spec.ts`;
          console.log(`Writing test file: ${testFileName}`);
          
          writeTestFile(testFile, parsedFeature, scenario);
        } else {
          console.error('Test file validation failed:', validationErrors);
        }
      } else {
        console.log('Skipping test file generation due to errors');
      }
    }
  }
  
  console.log('\nTest generation completed');
}

function generateTestFile(
  feature: ParsedFeature,
  scenario: ParsedScenario,
  testSteps: string
): string {
  return `
import { test, expect } from '@playwright/test';

test.describe('${feature.title}', () => {
  test('${scenario.title}', async ({ page }) => {
    ${testSteps}
  });
});`.trim();
}

function writeTestFile(
  content: string,
  feature: ParsedFeature,
  scenario: ParsedScenario
): void {
  const featureName = feature.feature.replace(/\s+/g, '_').toLowerCase();
  const scenarioName = scenario.title.replace(/\s+/g, '_').toLowerCase();
  const testFileName = `${featureName}_${scenarioName}.spec.ts`;
  const testFilePath = path.join(generatedTestsDir, testFileName);
  writeFileSync(testFilePath, content, 'utf-8');
  console.log(`Generated test: ${testFilePath}`);
}

export async function generatePlaywrightTest(scenario: any, steps: string[]): Promise<string> {
  const testCode = `
import { test, expect } from '@playwright/test';

test('${scenario.title}', async ({ page }) => {
  ${steps.join('\n  ')}
});
`;

  return testCode;
}
