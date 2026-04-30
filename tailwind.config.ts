import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F1964',
          light: '#6B2385',
          dark: '#380F47',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#F9DA82',
          light: '#FBE5A8',
          dark: '#F0C84A',
          foreground: '#1A1A2E'
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8F7FA',
          border: '#E5E0EA'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(79, 25, 100, 0.08)'
      }
    }
  },
  plugins: []
} satisfies Config
