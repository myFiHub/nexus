module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'podium-primary-blue': '#61dafb',
        'podium-secondary-blue': '#1e90ff',
        'podium-black': '#222',
        'podium-white': '#fff',
        'podium-primary-text': '#f5f5f5',
        'podium-page-bg': '#282c34',
        'podium-card-bg': '#20232a',
        'podium-card-border': '#444',
        'podium-button-outline': '#61dafb',
      },
    },
  },
  plugins: [],
}; 