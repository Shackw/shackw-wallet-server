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
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"]
    }
  }
});
