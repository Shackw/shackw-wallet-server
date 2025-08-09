import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginImport from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  {
    ignores: ["eslint.config.mjs"]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      sourceType: "commonjs",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    plugins: {
      import: pluginImport,
      "unused-imports": unusedImports
    }
  },
  {
    rules: {
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_"
        }
      ],
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal"
            }
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true
          }
        }
      ]
    }
  }
);
