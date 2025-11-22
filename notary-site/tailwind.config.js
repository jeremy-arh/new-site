/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'custom': '1150px',
      },
      fontFamily: {
        'sans': ['Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'geist': ['Geist', 'sans-serif'],
      },
      colors: {
        'primary': '#1a1a1a',
        'accent': '#4a90e2',
      },
    },
  },
  plugins: [],
}
