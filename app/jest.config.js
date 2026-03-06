module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  testMatch: ["**/*.spec.ts"],
  roots: ["<rootDir>/src"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.spec.ts", "!src/main.ts"],
  globals: {
    "ts-jest": {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: false,
        skipLibCheck: true,
      },
    },
  },
};
