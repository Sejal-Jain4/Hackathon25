/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        secondary: {
          50: '#f5f0ff',
          100: '#ede5ff',
          200: '#dccbff',
          300: '#c4a6fe',
          400: '#aa83fd',
          500: '#9259f7',
          600: '#8244ea',
          700: '#6d35c7',
          800: '#5a2da0',
          900: '#4a2479',
        },
        dark: {
          100: '#cfd1d9',
          200: '#a0a3b1',
          300: '#6f7489',
          400: '#4a4f66',
          500: '#2a2f45',
          600: '#1f2436',
          700: '#161a27',
          800: '#0d1019',
          900: '#070a0f',
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
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.6)' },
          '100%': { boxShadow: '0 0 20px rgba(146, 89, 247, 0.8)' }
        }
      }
    },
  },
  plugins: [],
}