import { mergeConfig } from "vitest/config";
import baseConfig from "./vitest.config";
import { config } from "dotenv";

config({ path: ".env" });

export default mergeConfig(baseConfig, {
  test: {
    include: ["src/**/*.spec.ts", "test/e2e/**/*.e2e.spec.ts"],
    hookTimeout: 60_000,
    testTimeout: 60_000,
    env: {
      NODE_ENV: "development"
    }
  }
});
