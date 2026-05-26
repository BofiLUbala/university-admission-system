/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ulk: {
          blue: {
            DEFAULT: '#0d3b66',
            light: '#1e5485',
            dark: '#071e33',
            slate: '#1a2e40',
            hover: '#134775'
          },
          gold: {
            DEFAULT: '#f4d35e',
            light: '#fbf2c0',
            dark: '#c49a1d',
            hover: '#e8c241'
          },
          accent: '#ee964b',
          neutral: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            800: '#1e293b',
            900: '#0f172a'
          }
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
