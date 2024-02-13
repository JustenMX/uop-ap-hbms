/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}", // HTML and JavaScript files at the root
    "./javascript/**/*.js", // JavaScript files in the javascript folder and its subfolders
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
