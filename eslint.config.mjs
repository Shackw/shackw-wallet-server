// @ts-check
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginImportX from "eslint-plugin-import-x";
import unusedImports from "eslint-plugin-unused-imports";

const barrelPatterns = [
  { group: ["@/application/errors/*"], message: "Use errors barrel (index.ts) only." },
  { group: ["@/application/policies/*/*"], message: "Use policy barrel (index.ts) only." },
  { group: ["@/application/protocols/*/*"], message: "Use protocol barrel (index.ts) only." },
  { group: ["@/application/services/*/*"], message: "Use service barrel (index.ts) only." },
  { group: ["@/application/mappers/*"], message: "Use mapper barrel (index.ts) only." }
];

export default [
  { ignores: ["dist", "node_modules", "coverage", "eslint.config.mjs"] },

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
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" }
      ],

      "import-x/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
          pathGroups: [{ pattern: "@/**", group: "internal", position: "after" }],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true }
        }
      ],

      "import-x/no-restricted-paths": [
        "error",
        {
          zones: [
            { target: "./src/domain", from: "./src/application", message: "domain must not depend on application" },
            { target: "./src/domain", from: "./src/interfaces", message: "domain must not depend on interfaces" },
            {
              target: "./src/domain",
              from: "./src/infrastructure",
              message: "domain must not depend on infrastructure"
            },
            {
              target: ["./src/application", "!./src/application/ports"],
              from: "./src/interfaces",
              message: "application must not depend on interfaces"
            },
            {
              target: ["./src/application", "!./src/application/ports"],
              from: "./src/infrastructure",
              message: "application must not depend on infrastructure"
            }
          ]
        }
      ],
      "no-restricted-imports": ["error", { patterns: barrelPatterns }]
    }
  },

  {
    files: ["src/application/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: barrelPatterns,
          paths: [
            {
              name: "@nestjs/common",
              importNames: [
                "BadRequestException",
                "UnauthorizedException",
                "ForbiddenException",
                "NotFoundException",
                "ConflictException",
                "InternalServerErrorException",
                "HttpException"
              ],
              message: "Application layer must not depend on NestJS HTTP exceptions. Use ApplicationError instead."
            }
          ]
        }
      ]
    }
  },

  eslintPluginPrettierRecommended
];
