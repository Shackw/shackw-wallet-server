import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.spec.ts"],
    hookTimeout: 30_000,
    testTimeout: 30_000,
    env: {
      NODE_ENV: "test"
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/application", "src/infrastructure", "src/interfaces"],
      exclude: ["src/application/errors", "src/application/ports", "src/infrastructure/masters"]
    }
  }
});
