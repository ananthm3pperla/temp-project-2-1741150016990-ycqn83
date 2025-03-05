/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          light: 'var(--color-secondary-light)',
          dark: 'var(--color-secondary-dark)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
          dark: 'var(--color-accent-dark)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
      },
      backgroundColor: {
        'app': 'var(--bg-app)',
        'card': 'var(--bg-card)',
        'card-hover': 'var(--bg-card-hover)',
      },
      textColor: {
        'default': 'var(--text-default)',
        'muted': 'var(--text-muted)',
        'light': 'var(--text-light)',
      },
      borderColor: {
        'default': 'var(--border-default)',
        'dark': 'var(--border-dark)',
      },
      ringOffsetColor: {
        'app': 'var(--bg-app)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};