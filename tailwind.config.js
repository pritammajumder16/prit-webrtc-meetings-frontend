/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBg: "#2b4162",
        lightBg: "#f9fcff",
      },
    },
  },
  plugins: [],
};
