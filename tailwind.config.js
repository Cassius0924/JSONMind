/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        slate: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          400: '#94A3B8',
          100: '#F1F5F9',
        },
      },
      backgroundColor: {
        'dark-primary': '#0F172A',
        'dark-secondary': '#1E293B',
      },
      borderColor: {
        'dark-border': '#334155',
      },
    },
  },
  plugins: [],
}
