/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Podium color scheme based on colors.xml
        'podium': {
          'white': '#FFFFFF',
          'primary-text': '#FFFFFF',
          'secondary-text': '#7781A6',
          'grey-text': '#C1C1C4',
          'system-tray': '#245A6C',
          'black': '#000000',
          'page-bg': '#141422',
          'card-bg': '#14142B',
          'button-outline': '#5D6583',
          'gradient-start': '#245A6C',
          'gradient-end': '#151523',
          'navbar': '#161D2C',
          'card-border': '#2A2A40',
          'primary-blue': '#54E4EF',
          'secondary-blue': '#4579FD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 