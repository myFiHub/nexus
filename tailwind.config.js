module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'podium-primary-blue': 'var(--primary-500)',
        'podium-secondary-blue': 'var(--secondary-500)',
        'podium-black': 'var(--neutral-900)',
        'podium-white': 'var(--neutral-50)',
        'podium-primary-text': 'var(--text-primary)',
        'podium-page-bg': 'var(--bg-primary)',
        'podium-card-bg': 'var(--bg-primary)',
        'podium-card-border': 'var(--border-color)',
        'podium-button-outline': 'var(--primary-500)',
        'success': 'var(--success)',
        'error': 'var(--error)',
        'warning': 'var(--warning)',
        'info': 'var(--info)',
        // Add more as needed
      },
    },
  },
  plugins: [],
}; 