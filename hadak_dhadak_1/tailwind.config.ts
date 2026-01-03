import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f2f7ff",
          100: "#e4edff",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e3a8a"
        }
      }
    }
  },
  plugins: []
};
export default config;
