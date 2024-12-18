export const createTestStep = (text: string): string => {
  return text.replace(/^(Given|When|Then|And)\s+/i, '').trim();
};

export const comparePlaywrightCode = (actual: string, expected: string): boolean => {
  const normalizeCode = (code: string): string => 
    code.replace(/\s+/g, ' ').trim();
  return normalizeCode(actual) === normalizeCode(expected);
}; 