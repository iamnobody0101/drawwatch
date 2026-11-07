// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  { ignores: ["**/node_modules/**", "**/coverage/**", "**/dist/**"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["learning/**/*.js"],
    languageOptions: { globals: globals.browser },
  },
  ...storybook.configs["flat/recommended"],
]);
