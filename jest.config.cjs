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
};

module.exports = config;