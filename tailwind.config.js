const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.liquid", "./src/**/*.md"],
  safelist: ["sr-only"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        serif: ["Dropkicker", ...defaultTheme.fontFamily.serif],
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.5)" },
          "100%": { transform: "scale(1)" },
        },
        rotateInY: {
          from: {
            transform: "rotateY(70deg)",
            opacity: "0",
          },
          to: {
            transform: "rotateY(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        pop: "pop 0.5s ease-out",
        rotateInY: "rotateInY 1s ease-out",
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
  darkMode: "selector",
};
