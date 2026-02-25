/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'nova-primary': '#1E1B4B',
        'nova-secondary': '#312E81',
        'nova-cta': '#F97316',
        'nova-bg': '#0F0F23',
        'nova-text': '#F8FAFC',
        'nova-muted': '#94A3B8',
      },
      fontFamily: {
        display: ['Newsreader', 'serif'],
        body: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}