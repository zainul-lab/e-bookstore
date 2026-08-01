import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: 'var(--color-brand)',
        accent: 'var(--color-accent)',
        ink: 'var(--color-ink)',
        parchment: 'var(--color-parchment)',
        pine: 'var(--color-pine)',
      },
      keyframes: {
        toast: {
          '0%':   { opacity: '0', transform: 'translateY(8px) scale(0.97)' },
          '12%':  { opacity: '1', transform: 'translateY(0)   scale(1)'    },
          '80%':  { opacity: '1', transform: 'translateY(0)   scale(1)'    },
          '100%': { opacity: '0', transform: 'translateY(4px) scale(0.97)' },
        },
      },
      animation: {
        toast: 'toast 2.8s ease forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;
