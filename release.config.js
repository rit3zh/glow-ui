module.exports = {
  bumpFiles: [
    "package.json",
    { filename: "src/constants/version.ts", type: "json" },
  ],
  header:
    "# Changelog\n\nAll notable changes to this project will be documented in this file.\n",
  types: [
    { type: "feat", section: "✨ Features" },
    { type: "fix", section: "🐛 Bug Fixes" },
    { type: "docs", section: "📝 Documentation" },
    { type: "chore", section: "⚙️ Chores" },
  ],
  skip: {
    tag: false,
  },
};
