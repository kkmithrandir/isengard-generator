export const config = {
  paths: {
    features: '../features',
    generatedTests: '../generated-tests',
    models: '../models',
    trainData: '../data/train_data.json'
  },
  test: {
    viewport: {
      width: 1280,
      height: 720
    },
    timeout: 30000,
    retries: 2
  },
  patterns: {
    similarityThreshold: 0.8,
    navigationThreshold: 0.6
  }
}; 