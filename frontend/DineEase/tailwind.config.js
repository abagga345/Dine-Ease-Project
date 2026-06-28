/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Heritage / Royal Indian palette
        brand: {
          maroon: "#7B1E1E",
          "maroon-dark": "#5E1414",
          "maroon-light": "#9A3636",
          turmeric: "#E0A500",
          "turmeric-dark": "#C28E00",
          terracotta: "#C75B2A",
          "terracotta-dark": "#A8481E",
          cream: "#FBF4E6",
          "cream-dark": "#F2E7CE",
          ink: "#2B2018", // deep brown text
          "ink-soft": "#5C4F42",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Mukta"', '"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -6px rgba(123, 30, 30, 0.18)",
        card: "0 8px 30px -10px rgba(43, 32, 24, 0.20)",
        "card-hover": "0 16px 40px -12px rgba(123, 30, 30, 0.28)",
      },
      backgroundImage: {
        "hero-fade":
          "linear-gradient(180deg, rgba(43,32,24,0.05), rgba(251,244,230,1))",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "slide-in-right": "slide-in-right 0.25s ease-out both",
      },
    },
  },
  plugins: [],
};
