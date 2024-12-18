// src/parseGherkin.ts

import { readFileSync } from 'fs';
import path from 'path';
import { Parser, AstBuilder, GherkinClassicTokenMatcher } from '@cucumber/gherkin';
import * as messages from '@cucumber/messages';

interface GherkinStep {
  keyword: string;
  text: string;
  line: number;
}

interface GherkinScenario {
  name: string;
  steps: GherkinStep[];
}

interface GherkinFeature {
  name: string;
  scenarios: GherkinScenario[];
}

interface GherkinChild {
  scenario?: {
    name: string;
    steps: GherkinStepData[];
  };
}

interface GherkinStepData {
  keyword: string;
  text: string;
  line: number;
}

export default async function parseFeatureFile(filePath: string): Promise<GherkinFeature> {
  const featureContent = readFileSync(filePath, 'utf-8');
  const parser = new Parser(
    new AstBuilder(messages.IdGenerator.uuid()),
    new GherkinClassicTokenMatcher()
  );
  
  const gherkinDocument = parser.parse(featureContent) as {
    feature?: {
      name: string;
      children: GherkinChild[];
    };
  };
  
  if (!gherkinDocument.feature) {
    throw new Error('No feature found in file');
  }

  const parsedFeature: GherkinFeature = {
    name: path.basename(filePath, '.feature'),
    scenarios: []
  };

  gherkinDocument.feature.children.forEach((child: GherkinChild) => {
    if (child.scenario) {
      const parsedSteps: GherkinStep[] = child.scenario.steps.map((step: GherkinStepData) => ({
        keyword: step.keyword.trim(),
        text: step.text,
        line: step.line
      }));

      parsedFeature.scenarios.push({
        name: child.scenario.name,
        steps: parsedSteps
      });
    }
  });

  return parsedFeature;
}
