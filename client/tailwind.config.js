module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  theme: {
    fontFamily: {
      serif: ["Merriweather", "serif"],
      sans: ["Work Sans", "sans-serif"],
    },
  },
  daisyui: {
    themes: [
      "corporate",
      "dark",
      "dracula",
      "cyberpunk",
      "pastel",
      "cupcake",
      "nord",
    ],
  },
};
