/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Ensure you have Inter imported in index.css
      },
      colors: {
        border: "hsl(var(--border))",
        background: "#ffffff",
        foreground: "#0f172a", // Slate 900
        
        // Extracted from SHNOOR Logo
        brand: {
          50: '#f0f6fa',
          100: '#e0ecf5',
          200: '#c2dbe9',
          300: '#94c2db',
          400: '#4da3c8',
          500: '#0B2F4E', // Core Brand Color (Deep Navy)
          600: '#08253e',
          700: '#061d31',
          800: '#051829',
          900: '#030c14',
        },
        // The Gold Accent
        accent: {
          DEFAULT: '#E8AA25',
          hover: '#c9911b',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}