module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  theme: {
    extends: {
      nav_height: "4rem",
    },
  },
  daisyui: {
    themes: [
      "light",
      "dark",
      "dracula",
      "cyberpunk",
      "pastel",
      "cupcake",
      "nord",
    ],
  },
};
