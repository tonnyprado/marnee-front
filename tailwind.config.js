/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          // Marnee design system fonts
          'display': ['Cormorant Garamond', 'Georgia', 'serif'],
          'mono':    ['DM Mono', 'Courier New', 'monospace'],
          // Default body — DM Sans first, legacy Inter as fallback
          'sans': ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
          // Legacy serif kept for components not yet migrated
          'serif': ['Playfair Display', 'Georgia', 'serif'],
        },
        colors: {
          // Marnee design system palette
          mn: {
            ice:    '#f6f6f6',
            black:  '#1e1e1e',
            purple: '#40086d',
            lilac:  '#dccaf4',
            night:  '#1a0530',
          },
          // Legacy brand colors (kept during migration)
          brand: {
            primary:   '#7c3aed',
            secondary: '#4f46e5',
            accent:    '#06b6d4',
          },
        },
      },
    },
    plugins: [],
  }
