/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          sage: {
            50: '#f2f5f2',
            100: '#e4e9e4',
            200: '#c7d3c7',
            300: '#a9bca9',
            400: '#8ba58b',
            500: '#6b8e6b',
            600: '#4a644a',
            700: '#2d3f2f',
            800: '#B2AC88',
            900: '#BAB86C',
          },
        },
      },
    },
    plugins: [],
  }