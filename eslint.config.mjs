import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import pluginReactNative from "eslint-plugin-react-native";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 1) Base JS rules
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },

  // 2) Browser globals
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },

  // 3) TypeScript rules
  tseslint.configs.recommended,

  // 4) React (JSX) rules, flat-config style
  pluginReact.configs.flat.recommended,

  // 5) React-Native rules
  pluginReactNative.configs.recommended,
]);
