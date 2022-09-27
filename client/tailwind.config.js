/** @type {import('tailwindcss').Config} */

module.exports = {
  // mode: "jit",

  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      colors: {},
    },
  },
  plugins: [require("flowbite/plugin")],
};
