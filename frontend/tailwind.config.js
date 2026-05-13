/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0B1020",
          secondary: "#111827",
        },
        card: "rgba(30, 41, 59, 0.55)",
        electric: "#00D9FF",
        cyan: "#38BDF8",
        surface: "#F8FAFC",
        muted: "#94A3B8",
        danger: "#EF4444",
        success: "#10B981",
      },
      fontFamily: {
        display: ["Orbitron", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-glow":
          "linear-gradient(rgba(0,217,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.08) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,217,255,0.25), transparent)",
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 217, 255, 0.35), 0 0 60px rgba(56, 189, 248, 0.15)",
        "neon-sm": "0 0 12px rgba(0, 217, 255, 0.4)",
        depth: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "glow-text": "glow-text 2.5s ease-in-out infinite",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        "glow-text": {
          "0%, 100%": {
            textShadow:
              "0 0 20px rgba(0,217,255,0.5), 0 0 40px rgba(56,189,248,0.3)",
          },
          "50%": {
            textShadow:
              "0 0 30px rgba(0,217,255,0.8), 0 0 60px rgba(56,189,248,0.45)",
          },
        },
      },
    },
  },
  plugins: [],
};
