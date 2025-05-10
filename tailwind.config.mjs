export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        text: {
          main: 'var(--color-text-main)',
          muted: 'var(--color-text-muted)',
        },
      },
      fontFamily: {
        main: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        lg: 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
}; 