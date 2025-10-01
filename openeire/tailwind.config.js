/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Define our brand colors for easy use
      colors: {
        'primary': '#16a34a', // The main brand green
        'accent': '#FFC400',  // A vibrant gold for highlights
        'dark': '#1a1a1a',    // A softer black for backgrounds like the navbar/footer
      },
      // Define our brand fonts
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'], // For headings
        'serif': ['Merriweather', 'serif'], // For body text
      },
    },
  },
  plugins: [],
}