/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '1024px',
        'md': '1920px',
        'xl': '2560px'
      }

    },
  },
  plugins: [],
}