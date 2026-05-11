import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefcff",
          100: "#d6f6ff",
          200: "#b1eeff",
          300: "#75e2ff",
          400: "#31cdff",
          500: "#06b0ef",
          600: "#008bcc",
          700: "#046fa5",
          800: "#0a5c87",
          900: "#0e4c70",
          950: "#07304a"
        },
        ink: {
          50: "#f5f7fa",
          100: "#e9edf3",
          900: "#0a0f1c",
          950: "#05080f"
        },
        gold: { 400: "#ffd66b", 500: "#f5b301" }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px 0 rgba(6,176,239,0.35)",
        "glow-lg": "0 0 80px 0 rgba(6,176,239,0.45)"
      },
      backgroundImage: {
        "grid-dark":
          "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
        "radial-brand":
          "radial-gradient(ellipse at top, rgba(6,176,239,0.25), transparent 60%)"
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "gradient-x": "gradient-x 8s ease infinite",
        "fade-up": "fadeUp .7s ease both"
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" }
        },
        "gradient-x": {
          "0%,100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};
export default config;
