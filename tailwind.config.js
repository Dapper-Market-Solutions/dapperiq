/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          50:  '#f0f5ff',
          100: '#d9e4f5',
          200: '#b3c9eb',
          300: '#7aa3d4',
          400: '#4a7dbd',
          500: '#1e4a75',
          600: '#00427c',
          700: '#003566',
          800: '#00274c',
          900: '#001a33',
        },
        gold: {
          400: '#ffcb05',
          500: '#ffc001',
        },
      },
    },
  },
  plugins: [],
}
