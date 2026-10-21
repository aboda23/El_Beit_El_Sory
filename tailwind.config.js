/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0D0E12',
          secondary: '#13151D',
          card: '#1A1D27',
          cardHover: '#222634',
          input: '#181A24',
          subtle: '#262A3B',
        },
        border: {
          dark: '#262A3B',
          light: '#353A50',
          accent: 'rgba(245, 166, 35, 0.4)',
        },
        accent: {
          DEFAULT: '#F5A623',
          hover: '#E09212',
          light: '#FBBF24',
          subtle: 'rgba(245, 166, 35, 0.12)',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
          hover: '#20BA59',
          subtle: 'rgba(37, 211, 102, 0.12)',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Cairo', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cairo', 'Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'glow-accent': '0 0 25px -5px rgba(245, 166, 35, 0.3)',
        'glow-whatsapp': '0 0 25px -5px rgba(37, 211, 102, 0.3)',
      },
      borderRadius: {
        'card': '16px',
        'pill': '9999px',
      }
    },
  },
  plugins: [],
}
