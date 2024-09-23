import { fixupConfigRules } from "@eslint/compat";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["**/dist", "**/_site", "!**/.stylelintrc.json"],
  },
  ...fixupConfigRules(
    compat.extends(
      "eslint:recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:compat/recommended",
      "plugin:json/recommended",
      "plugin:promise/recommended",
      "plugin:prettier/recommended",
    ),
  ),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        allowImportExportEverywhere: true,

        ecmaFeatures: {
          impliedStrict: true,
        },
      },
    },

    settings: {
      "import/external-module-folders": ["node_modules", "web_modules"],
    },
  },
];
