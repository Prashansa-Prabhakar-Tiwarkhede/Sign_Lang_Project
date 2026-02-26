/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: '#0aff95',
        darkbg: '#0a0a0c',
      },
    },
  },
  plugins: [],
}