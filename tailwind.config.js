/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: '#0f172a',
          raised: '#1e293b',
          overlay: '#273548',
          border: '#334155',
        },
      },
    },
  },
  plugins: [],
}
