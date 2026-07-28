import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#6b2f1f',
        accent: '#c2883a',
        ink: '#241813',
        parchment: '#f6efe6',
        pine: '#2f5d50',
      },
    },
  },
  plugins: [],
} satisfies Config;
