import { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10b981",
        secondary: "#f0fdf4",
        select: "#a7f3d0",
        primarytxt: "#022c22",
      },
      fontFamily: {
        serif: ["DMSerifText-Regular", "serif"],
        mono: ["GeistMonoVF", "mono"],
        sans: ["GeistVF", "sans"],
      },
    },
  },
  plugins: [],
};

export default config;
