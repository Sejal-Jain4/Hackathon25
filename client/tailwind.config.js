/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f5ff',
          100: '#cceaff',
          200: '#99d6ff',
          300: '#66c1ff',
          400: '#33adff',
          500: '#0099ff',
          600: '#007acc',
          700: '#005c99',
          800: '#003d66',
          900: '#001f33',
        },
        secondary: {
          50: '#f5f9ff',
          100: '#ebf3ff',
          200: '#d6e6ff',
          300: '#c2daff',
          400: '#adcdff',
          500: '#99c1ff',
          600: '#7a9acc',
          700: '#5c7499',
          800: '#3d4d66',
          900: '#1f2733',
        },
        success: '#10B981',
        warning: '#FBBF24',
        error: '#EF4444',
        background: '#F9FAFB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
}