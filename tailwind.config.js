/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "app/index.tsx",
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
