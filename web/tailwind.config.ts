import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6',
        secondary: '#3b82f6',
        dark: '#0a0a1a',
      },
    },
  },
  plugins: [],
};

export default config;
