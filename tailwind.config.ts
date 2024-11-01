import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5542F6",
        hightlight: '#eae8fb',
        bgGray: '#fbfafd',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(44deg, rgba(187,247,208,0.11808473389355745) 0%, rgba(187,247,208,0.2189250700280112) 100%);"
      }
    },
  },
  plugins: [],
};
export default config;
