module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'bg': 'var(--color-bg)',
        'surface': 'var(--color-surface)',
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
        'success': 'var(--color-success)',
        'error': 'var(--color-error)',
        'text-main': 'var(--color-text-main)',
        'text-muted': 'var(--color-text-muted)',
      },
      borderRadius: {
        'lg': 'var(--radius-lg)',
      },
      boxShadow: {
        'lg': 'var(--shadow-lg)',
      },
      fontFamily: {
        'main': [ 'var(--font-main)' ],
      },
    },
  },
  plugins: [],
}; 