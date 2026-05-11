const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const svelteParser = require("svelte-eslint-parser");
const sveltePlugin = require("eslint-plugin-svelte");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
  {
    ignores: [
      ".DS_Store",
      "node_modules",
      "build",
      ".svelte-kit",
      "package",
      ".env",
      ".env.*",
      "!.env.example",
      "pnpm-lock.yaml",
      "package-lock.json",
      "yarn.lock",
      "dist",
    ],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        sourceType: "module",
        ecmaVersion: 2020,
        extraFileExtensions: [".svelte"],
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      svelte: sveltePlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...sveltePlugin.configs.recommended.rules,
      ...prettierConfig.rules,
    },
  },
];
