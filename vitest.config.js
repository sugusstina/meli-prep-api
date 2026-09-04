import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",

    setupFiles: [
      "./tests/setup/env.js",
      "./tests/setup/database.js"
    ],

    include: [
      "tests/integration/**/*.test.js"
    ],

    fileParallelism: false
  }
});