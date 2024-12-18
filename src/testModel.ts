// src/testModel.ts

import { Model, TestData } from './types';

export async function testModel(model: Model, testData: TestData[]): Promise<void> {
  for (const example of testData) {
    const prediction = await model.predict(example.input);
    console.log(`Expected: ${example.expected}`);
    console.log(`Predicted: ${prediction}`);
  }
}
