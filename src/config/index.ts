import * as path from 'path';

export const config = {
  paths: {
    features: path.resolve(__dirname, '../../features'),
    generatedTests: path.resolve(__dirname, '../../generated-tests'),
    trainData: path.resolve(__dirname, '../../data/train_data.json')
  },
  patterns: {
    similarityThreshold: 0.7,
    minPatternLength: 3
  },
  testing: {
    browser: 'chromium',
    headless: true,
    timeout: 30000
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: 'gherkin-playwright.log'
  }
}; 