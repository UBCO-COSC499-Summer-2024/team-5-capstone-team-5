module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      colors: {
        primary: '#1f2937', // Dark background color
        secondary: '#374151', // Secondary dark color
        accent: '#9ca3af', // Light accent color
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
