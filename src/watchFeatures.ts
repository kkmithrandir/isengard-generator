// src/watchFeatures.ts

import chokidar, { FSWatcher } from 'chokidar';
import path from 'path';
import { Stats } from 'fs';
import { generatePlaywrightTests } from './generatePlaywrightTests';

const featuresDir = path.resolve(__dirname, '../features');

console.log('Starting test generation process...');
console.log(`Features directory: ${featuresDir}`);

// Generate tests and exit
console.log('Generating tests...');
generatePlaywrightTests()
  .then(() => {
    console.log('Test generation completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during test generation:', error);
    process.exit(1);
  });
