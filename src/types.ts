export interface Model {
  predict(input: any): Promise<any>;
  train?(data: any[], options?: any): Promise<void>;
}

export interface TrainingData {
  input: any;
  output: any;
}

export interface TestData {
  input: any;
  expected: any;
} 