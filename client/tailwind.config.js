/** @type {import('tailwindcss').Config} */

module.exports = {
  // mode: "jit",

  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx,vue}",
    "./node_modules/flowbite/**/*.js",
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
