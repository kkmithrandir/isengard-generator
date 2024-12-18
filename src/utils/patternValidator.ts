export class PatternValidator {
  validatePattern(pattern: string): boolean {
    // Must have at least one variable
    if (!pattern.includes('{') || !pattern.includes('}')) {
      return false;
    }

    // Check variable format
    const variables = pattern.match(/\{[^}]+\}/g) || [];
    return variables.every(variable => {
      const name = variable.slice(1, -1);
      return /^[a-z][a-zA-Z0-9]*$/.test(name);
    });
  }

  validatePlaywrightCode(code: string): boolean {
    return (
      code.includes('await') &&
      code.includes('page.') &&
      !code.includes('undefined') &&
      !code.includes('null')
    );
  }
} 