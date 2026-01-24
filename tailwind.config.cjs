// module.exports = {
//   content: [
//     './index.html',
//     './src/**/*.{js,jsx,ts,tsx}'
//   ],
//   darkMode: 'class',
//   theme: {
//     extend: {}
//   },
//   plugins: []
// }
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ===== BRAND COLORS (from your image) ===== */
        primary: '#2C666E',        // teal blue
        primaryDark: '#1F4E55',

        secondary: '#F4A261',      // soft orange
        secondaryDark: '#E76F51',

        surface: '#F8FAFC',        // card bg (light)
        surfaceDark: '#0F172A',    // card bg (dark)

        background: '#EDF6F9',     // page bg (light)
        backgroundDark: '#020617', // page bg (dark)

        textPrimary: '#0F172A',
        textSecondary: '#475569',

        textPrimaryDark: '#E5E7EB',
        textSecondaryDark: '#94A3B8',
      },
    },
  },
  plugins: [],
}
