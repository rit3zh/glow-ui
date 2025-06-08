const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");
const rules = require("./rules");

/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["plugin:prettier/recommended", "prettier", "turbo"],
  plugins: ["prettier", "only-warn"],

  globals: {
    React: true,
    JSX: true,
  },

  env: {
    browser: true,
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
    // Force ESLint to detect .tsx files
    { files: ["*.js?(x)", "*.ts?(x)"] },
  ],
  ...rules,
};
