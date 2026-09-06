import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactNative from "eslint-plugin-react-native";
import configPrettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "**/node_modules/**",
    "**/.expo/**",
    "**/dist/**",
    "**/build/**",
    "website/**",
    "cloudflare/generated/**",
    "**/*.generated.ts",
  ]),

  // 1) Base JS rules
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },

  // 2) Runtime globals
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.es2021 },
    },
  },

  // 3) TypeScript rules
  ...tseslint.configs.recommended,

  // 4) React (JSX) rules, flat-config style
  {
    ...pluginReact.configs.flat.recommended,
    settings: { react: { version: "detect" } },
  },

  // 5) React-Native rules. The plugin ships no flat `recommended` config, so
  // the rules are wired up by hand.
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { "react-native": pluginReactNative },
    rules: {
      "react-native/no-unused-styles": "warn",
      "react-native/no-single-element-style-arrays": "warn",
      "react-native/split-platform-components": "off",
      "react-native/no-inline-styles": "off",
      "react-native/no-color-literals": "off",
      "react-native/no-raw-text": "off",
    },
  },

  // 6) Project conventions
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // The new JSX transform makes the React import optional.
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  configPrettier,
]);
