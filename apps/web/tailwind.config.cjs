/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1d9bf0", // Twitter Blue
          hover: "#1a8cd8",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        gray: {
          DEFAULT: "#536471",
          light: "#cfd9de",
          extraLight: "#f7f9f9",
        }
      },
    },
  },
  plugins: [],
}
