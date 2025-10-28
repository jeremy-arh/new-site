/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'tasa': ['"TASA Orbiter"', 'sans-serif'],
      },
      colors: {
        'primary': '#1a1a1a',
        'accent': '#4a90e2',
      },
    },
  },
  plugins: [],
}
