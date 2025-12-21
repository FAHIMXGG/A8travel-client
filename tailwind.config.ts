import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-subtext)"],
        headline: ["var(--font-headline)"],
        subtext: ["var(--font-subtext)"],
        "subtext-alt": ["var(--font-subtext-alt)"],
        accent: ["var(--font-accent)"],
      },
    },
  },
  plugins: [],
}
export default config
