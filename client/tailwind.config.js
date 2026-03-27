/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:       "#0a0a0f",
        surface:  "#111118",
        surface2: "#1a1a24",
        border:   "#2a2a3a",
        accent:   "#e8ff3c",
        accent2:  "#ff3c6e",
        accent3:  "#3cddff",
        success:  "#10b981",
        text:     "#f0f0f8",
        warning:  "#f59e0b",
        danger:   "#ef4444",
        muted:    "#6a6a88",
        

      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.3)",
        glow: "0 0 20px rgba(37,99,235,0.3)",
      },
    },
  },
  plugins: [],
}