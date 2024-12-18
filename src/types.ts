export interface Model {
  predict(input: string): Promise<string>;
  train?(data: TrainingData[], options?: TrainingOptions): Promise<void>;
}

export interface TrainingData {
  input: string;
  output: string;
}

export interface TrainingOptions {
  epochs?: number;
  batchSize?: number;
}

export interface TestData {
  input: string;
  expected: string;
}

export interface Pattern {
  input: string;
  output: string;
}

export interface TestResult {
  passed: boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
} 