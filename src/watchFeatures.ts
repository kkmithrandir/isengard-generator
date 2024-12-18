// src/watchFeatures.ts

import path from 'path';
import { generatePlaywrightTests } from './generatePlaywrightTests';
import { Logger } from './utils/logger';

const featuresDir = path.resolve(__dirname, '../features');

Logger.info('Starting test generation process...');
Logger.info(`Features directory: ${featuresDir}`);

// Generate tests and exit
Logger.info('Generating tests...');
generatePlaywrightTests()
  .then(() => {
    Logger.info('Test generation completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    Logger.error('Error during test generation:', error);
    process.exit(1);
  });
