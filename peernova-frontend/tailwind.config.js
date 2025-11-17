/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monochrome color palette
        'black': '#0a0a0a',
        'charcoal': {
          '50': '#1a1a1a',
          '100': '#1f1f1f',
          '200': '#2a2a2a',
        },
        'gray': {
          '50': '#f0f0f0',
          '100': '#ffffff',
          '200': '#d0d0d0',
          '300': '#c0c0c0',
          '400': '#b0b0b0',
          '500': '#a0a0a0',
          '600': '#808080',
          '700': '#707070',
          '800': '#404040',
          '900': '#333333',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        'xl': '12px',
      },
      transitionDuration: {
        '300': '300ms',
      },
    },
  },
  plugins: [],
}
