import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm parchment palette
        parchment: {
          DEFAULT: "#f7f2e8",
          50: "#fbf8f1",
          100: "#f7f2e8",
          200: "#efe6d2",
          300: "#e2d3b3",
        },
        ink: {
          DEFAULT: "#1f1a16",
          soft: "#2d2620",
          muted: "#6b5a4a",
          faint: "#8e7f6e",
        },
        accent: {
          DEFAULT: "#8b6914",
          soft: "#a78229",
          deep: "#6f5210",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        hebrew: ["var(--font-hebrew)", "Georgia", "serif"],
      },
      maxWidth: {
        reader: "38rem",
        wide: "64rem",
      },
      letterSpacing: {
        "wide-caps": "0.08em",
      },
    },
  },
  plugins: [],
};

export default config;
