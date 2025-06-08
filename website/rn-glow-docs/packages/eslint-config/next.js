const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");
const rules = require("./rules");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",

  extends: [
    "prettier",
    "plugin:prettier/recommended",
    require.resolve("@vercel/style-guide/eslint/next"),
    "turbo",
  ],

  globals: {
    React: true,
    JSX: true,
  },

  env: {
    node: true,
    browser: true,
  },

  plugins: ['@typescript-eslint', "prettier", "only-warn"],

  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },

  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
  ],

  overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],

  ...rules,
};
