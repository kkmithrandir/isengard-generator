export class TestValidator {
  validateGeneratedCode(code: string): boolean {
    // Basic validation for generated code
    return code.includes('await') && 
           (code.includes('page.') || code.includes('expect'));
  }

  validateTestFile(content: string): string[] {
    const errors: string[] = [];

    if (!content.includes('import { test, expect }')) {
      errors.push('Missing Playwright imports');
    }

    if (!content.includes('async ({ page })')) {
      errors.push('Missing page parameter');
    }

    if (!content.includes('await')) {
      errors.push('Missing async/await');
    }

    return errors;
  }
} 