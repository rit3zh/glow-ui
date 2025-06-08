module.exports = {
  rules: {
    "prettier/prettier": [
      "error",
      {
        "semi": false,
        "singleQuote": true,
        "tabWidth": 2,
        "useTabs": false,
        "trailingComma": "es5"
      }
    ],

    "@next/next/no-html-link-for-pages": "off",
    "no-duplicate-imports": "error",
    "eslint-plugin-import/no-unassigned-import": "off"
  }
}
