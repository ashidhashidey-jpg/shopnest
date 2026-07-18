/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FBF7F3",
        plum: "#2E2433",
        "plum-soft": "#564a5e",
        gold: "#C9A66B",
        "gold-light": "#E4D2A8",
        mauve: "#D8B4C8",
        sage: "#9CAF88",
        coral: "#E89B9B",
        cream: "#F4EFE8",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(46, 36, 51, 0.06)",
        card: "0 2px 12px rgba(46, 36, 51, 0.08)",
      },
    },
  },
  plugins: [],
};
