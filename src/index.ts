import { generatePlaywrightTests } from './generatePlaywrightTests';
import { Logger } from './utils/logger';

async function main() {
  try {
    Logger.info('Starting test generation...');
    await generatePlaywrightTests();
    Logger.info('Test generation completed');
  } catch (error) {
    Logger.error('Error during test generation:', error);
    process.exit(1);
  }
}

main(); 