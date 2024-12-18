# Gherkin to Playwright Test Generator 🎭

A tool that automatically generates Playwright test scripts from Gherkin feature files. This project bridges the gap between BDD (Behavior-Driven Development) specifications and automated testing.

---

## 🎯 Main Objective

Convert Gherkin feature files into executable Playwright test scripts automatically, making it easier to maintain test automation that directly reflects business requirements.

---

## 📋 Prerequisites

- Node.js (>= 18.0.0)
- npm (comes with Node.js)
- VS Code (recommended)

---

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gherkin-playwright-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 📁 Project Structure

```plaintext
gherkin-playwright-generator/
├── src/
│   ├── utils/
│   │   ├── errorHandler.ts       # Error handling utilities
│   │   ├── logger.ts             # Logging functionality
│   │   ├── patternMatcher.ts     # Pattern matching logic
│   │   ├── stepHandler.ts        # Step definition handling
│   │   └── testValidator.ts      # Test validation
│   ├── config/
│   │   └── config.ts             # Configuration settings
│   ├── aiMapper.ts               # Core mapping logic
│   ├── generatePlaywrightTests.ts # Test generation logic
│   ├── parseGherkin.ts           # Gherkin parsing
│   └── watchFeatures.ts          # File watching for changes
├── features/                     # Gherkin feature files
├── generated-tests/              # Output directory for generated tests
├── data/
│   └── train_data.json           # Step patterns and mappings
└── playwright.config.ts          # Playwright configuration
```

---

## ⚙️ Configuration

### 1. VS Code Settings (`.vscode/settings.json`):

```json
{
  "files.associations": {
    ".feature": "gherkin"
  },
  "editor.quickSuggestions": {
    "strings": true,
    "comments": true,
    "other": true
  },
  "[gherkin]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "alexkrechik.cucumberautocomplete",
    "editor.wordWrap": "on",
    "editor.tabSize": 2
  },
  "cucumberautocomplete.steps": [
    "data/train_data.json"
  ],
  "cucumberautocomplete.strictGherkinCompletion": false,
  "cucumberautocomplete.customParameters": [
    {
      "parameter": "{url}",
      "value": ""([^"]*)""
    },
    {
      "parameter": "{text}",
      "value": ""([^"]*)""
    }
  ]
}
```

### 2. Playwright Configuration (`playwright.config.ts`):

```typescript
import { PlaywrightTestConfig } from '@playwright/test';
import { config } from './src/config/config';

const playwrightConfig: PlaywrightTestConfig = {
  timeout: config.test.timeout,
  retries: config.test.retries,
  use: {
    viewport: config.test.viewport,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/test-results.json' }],
  ],
};

export default playwrightConfig;
```

---

## 🗋 Usage

1. Write your feature files in the `features/` directory using Gherkin syntax:

   ```gherkin
   Feature: Login Functionality

   Scenario: Successful login
       Given I navigate to "https://example.com/login"
       When I enter valid credentials
       And I submit the login form
       Then I see "Dashboard" in the title
   ```

2. Run the test generator:
   ```bash
   npm run watch
   ```

3. Run the generated tests:
   ```bash
   npm test
   ```

---

## 🔄 Step Patterns

Step patterns are defined in `data/train_data.json`. Each pattern maps a Gherkin step to its corresponding Playwright code:

```json
{
  "gherkin": "I navigate to {url}",
  "playwright": "await page.goto('{url}')"
}
```

---

## 📄 Available Scripts

- `npm start` - Run the test generator once
- `npm test` - Run the generated Playwright tests
- `npm run watch` - Watch feature files and generate tests on changes
- `npm run build` - Build the TypeScript code
- `npm run lint` - Run ESLint

---

## ⚠️ Error Handling

The system includes comprehensive error handling for:
- Gherkin parsing errors
- Pattern matching errors
- Test generation errors
- Validation errors

---

  Made with ❤️ for better test automation

