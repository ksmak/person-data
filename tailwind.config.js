import { Config } from "tailwindcss";

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./app/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        primary: "#10b981",
        secondary: "#f0fdf4",
        select: "#a7f3d0",
        primarytxt: "#022c22",
        emerald600: "#059669",
        emerald500: "#10b981",
        emerald400: "#34d399",
        emerald200: "#a7f3d0",

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
