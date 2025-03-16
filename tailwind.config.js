/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f3f4f6",
          foreground: "#6b7280",
        },
        background: "#ffffff",
        foreground: "#1f2937",
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#3b82f6",
      },
      borderRadius: {
        radius: "0.5rem",
      },
    },
  },
  plugins: [],
}

