import type { Config } from 'tailwindcss'

export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    fontFamily: {
      Roboto: ['Roboto', 'sans-serif']
    },
    extend: {
      colors: {
        primary: {
          light: '#80d4ff',
          DEFAULT: '#00aaff',
          dark: '#0077cc',
        },
        white: {
          DEFAULT: '#ffffff',
          off: '#f0f0f0'
        }
      }
    },
  },
  plugins: [],
} satisfies Config

