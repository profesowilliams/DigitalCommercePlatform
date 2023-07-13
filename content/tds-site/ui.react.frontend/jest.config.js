module.exports = {
  setupFilesAfterEnv: ['<rootDir>/setUpTests.js'],
  watchPathIgnorePatterns: ['node_modules'],
  moduleNameMapper: {
    '\\.(scss|css)$': '<rootDir>/CSSStub.js',
  },
  testEnvironment: 'jest-environment-jsdom-sixteen',
};