/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function({addComponents}) {
      addComponents({
        '.container': {
        
        }
      })
    }),
    require('@tailwindcss/line-clamp'),
  ],
}