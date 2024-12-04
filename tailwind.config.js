import { Config } from "tailwindcss";

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./app/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        primary: "#6f96c3",
        secondary: "#edf2f7",
        select: "#b7cbe1",
        primarytxt: "#263e5a",
        emerald600: "#3c6390",
        emerald500: "#4470a2",
        emerald400: "#4b7cb4",
        emerald200: "#6f96c3",
        borderlight: "#EAEEEF",
        borderdark: "#F6E8DA",

      },
      fontFamily: {
        serif: ["DMSerifText-Regular", "serif"],
        mono: ["RobotoMono-Regular", "mono"],
        sans: ["GeistVF", "sans"],
      },
    },
  },
  plugins: [],
});

// const config: Config = {
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx}",
//     "./components/**/*.{js,ts,jsx,tsx}",
//     "./app/**/*.{js,ts,jsx,tsx}",
//     "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: "#10b981",
//         secondary: "#f0fdf4",
//         select: "#a7f3d0",
//         primarytxt: "#022c22",
//       },
//       fontFamily: {
//         serif: ["DMSerifText-Regular", "serif"],
//         mono: ["RobotoMono-Regular", "mono"],
//         sans: ["GeistVF", "sans"],
//       },
//     },
//   },
//   plugins: [],
// };

// export default config;
