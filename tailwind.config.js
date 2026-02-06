/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          'serif': ['Playfair Display', 'Georgia', 'serif'],
          'sans': ['Inter', 'system-ui', 'sans-serif'],
        },
        colors: {
          brand: {
            primary: '#7c3aed',    // violet-600
            secondary: '#4f46e5',  // indigo-600
            accent: '#06b6d4',     // cyan-500
          }
        }
      },
     },
     plugins: [],
  }
