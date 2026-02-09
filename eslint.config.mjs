// @ts-check
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginImportX from "eslint-plugin-import-x";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    ignores: ["dist", "node_modules", "coverage", "eslint.config.mjs"]
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ["src/**/*.ts", "test/**/*.ts"],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module"
      },
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },

    plugins: {
      "import-x": pluginImportX,
      "unused-imports": unusedImports
    },

    settings: {
      "import-x/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.eslint.json"]
        },
        node: true
      }
    },

    rules: {
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", disallowTypeAnnotations: false }
      ],

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

      "import-x/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "after"
            }
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true }
        }
      ]
    }
  },

  eslintPluginPrettierRecommended
];
