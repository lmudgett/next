import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Path to the Next.js app to load next.config and .env files into the test env
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // Unit tests live under __tests__/, mirroring the src/ tree they cover.
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  clearMocks: true,
};

export default createJestConfig(config);
