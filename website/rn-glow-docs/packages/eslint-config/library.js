const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");
const rules = require("./rules");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["prettier", "plugin:prettier/recommended", "turbo"],
  plugins: ["prettier", "only-warn"],

  globals: {
    React: true,
    JSX: true,
  },

  env: {
    node: true,
  },

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
    "dist/",
  ],

  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],

  ...rules,
};
