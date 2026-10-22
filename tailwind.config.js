/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { ink: '#050a12', panel: '#0c1726', cyan: '#35d8ff', violet: '#9672ff' }
    }
  },
  plugins: []
};
