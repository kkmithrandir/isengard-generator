// src/parseGherkin.ts

import { readFileSync } from 'fs';
import path from 'path';
import { Parser, AstBuilder, GherkinClassicTokenMatcher } from '@cucumber/gherkin';
import * as messages from '@cucumber/messages';

export interface ParsedStep {
  keyword: string;
  text: string;
}

export interface ParsedScenario {
  title: string;
  steps: ParsedStep[];
}

export interface ParsedFeature {
  feature: string;
  title: string;
  scenarios: ParsedScenario[];
}

export async function parseFeatureFile(filePath: string): Promise<ParsedFeature> {
  const featureContent = readFileSync(filePath, 'utf-8');
  const parser = new Parser(
    new AstBuilder(messages.IdGenerator.uuid()),
    new GherkinClassicTokenMatcher()
  );
  
  const gherkinDocument = parser.parse(featureContent);
  
  if (!gherkinDocument.feature) {
    throw new Error('No feature found in file');
  }

  const parsedFeature: ParsedFeature = {
    feature: path.basename(filePath, '.feature'),
    title: gherkinDocument.feature.name,
    scenarios: []
  };

  gherkinDocument.feature.children.forEach((child: any) => {
    if (child.scenario) {
      const parsedSteps: ParsedStep[] = child.scenario.steps.map((step: any) => ({
        keyword: step.keyword.trim(),
        text: step.text
      }));

      parsedFeature.scenarios.push({
        title: child.scenario.name,
        steps: parsedSteps
      });
    }
  });

  return parsedFeature;
}
