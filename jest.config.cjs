/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss)$": "<rootDir>/src/__mocks__/styleMock.cjs",
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
  coverageDirectory: "coverage",
};

module.exports = config;
