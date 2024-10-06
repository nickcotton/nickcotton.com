import globals from "globals";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import json from "@eslint/json";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import pluginPromise from "eslint-plugin-promise";

const jsConfig = {
  files: ["**/*.js"],
  ...js.configs.recommended,
  ...importPlugin.flatConfigs.recommended,
};

const jsonConfig = {
  files: ["**/*.json"],
  ignores: ["package-lock.json"],
  language: "json/json",
  ...json.configs.recommended,
};

export default [
  pluginPromise.configs["flat/recommended"],

  jsConfig,
  jsonConfig,
  {
    ignores: ["**/dist", "**/_site", "!**/.stylelintrc.json"],
  },
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
  eslintPluginPrettierRecommended,
];
