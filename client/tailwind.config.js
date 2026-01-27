/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#1e3a5f',
          900: '#0f2744',
        },
        carolina: {
          50: '#f0f7fc',
          100: '#e1eff9',
          200: '#c3dff3',
          300: '#9dcce9',
          400: '#7eb2d9',
          500: '#5d9cce',
          600: '#4a87bd',
          700: '#3a6d9a',
          800: '#2d5577',
          900: '#1e3a5f',
        },
        blue: {
          50: '#f0f7fc',
          100: '#e1eff9',
          200: '#c3dff3',
          300: '#9dcce9',
          400: '#7eb2d9',
          500: '#5d9cce',
          600: '#1e3a5f',
          700: '#183152',
          800: '#122845',
          900: '#0f2744',
        },
      },
    },
  },
  plugins: [],
}

