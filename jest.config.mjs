/** @type {import('jest').Config} */
export default {
  bail: true,

  clearMocks: true,

  coverageProvider: "v8",

  testEnvironment: "node",

  testMatch: ["<rootDir>/src/**/*.test.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  transform: {
    "^.+\\.ts$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript" },
          target: "es2022",
        },
      },
    ],
  },
  setupFiles:["dotenv/config"]
}
