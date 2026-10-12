/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Anton", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#09090b",
          900: "#18181b",
          800: "#27272a",
          700: "#3f3f46",
          600: "#52525b",
          500: "#71717a",
          400: "#a1a1aa",
          300: "#d4d4d8",
          200: "#e4e4e7",
          100: "#f4f4f5",
          50: "#fafafa",
        },
        accent: {
          DEFAULT: "#fafafa",
          dark: "#e4e4e7",
        },
        neon: {
          DEFAULT: "#22d3ee",
          dark: "#06b6d4",
        },
        brand: {
          cyan: "#22d3ee",
          pink: "#ec4899",
          yellow: "#facc15",
        }
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
