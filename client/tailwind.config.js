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
          50: '#e6f1fe',
          100: '#cce3fd',
          200: '#99c8fc',
          300: '#66acfa',
          400: '#3391f9',
          500: '#0077f8',
          600: '#0062cc',
          700: '#0051a8',
          800: '#003c7e',
          900: '#002654',
        },
        secondary: {
          50: '#f3f0ff',
          100: '#e9e3ff',
          200: '#d4c8fe',
          300: '#b79dfc',
          400: '#9a72f9',
          500: '#8152f0',
          600: '#6a40d4',
          700: '#5733aa',
          800: '#432980',
          900: '#321e56',
        },
        accent: {
          50: '#e6fcff',
          100: '#cef9ff',
          200: '#9df3ff',
          300: '#6beefc',
          400: '#3ae8fa',
          500: '#09e2f8',
          600: '#07b6c6',
          700: '#059ba8',
          800: '#04717b',
          900: '#02474d',
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
        background: '#0f172a',
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