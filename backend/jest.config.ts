/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testMatch: ["**/tests/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/setupTestDB.ts"],
  forceExit: true,
  clearMocks: true
};
