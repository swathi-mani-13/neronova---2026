/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jet: {
          950: '#050505',
          900: '#090909',
          850: '#0e0e0e',
          800: '#141414',
          700: '#1c1c1c',
          600: '#262626',
        },
        crimson: {
          DEFAULT: '#E50914',
          glow: '#ff1e27',
          dark: '#990008',
          deep: '#4a0004',
        },
        neonRed: {
          DEFAULT: '#FF3030',
          bright: '#ff4d4d',
          dark: '#cc1111',
        },
        evileye: {
          DEFAULT: '#00d2ff',
          core: '#ffffff',
          iris: '#0066ff',
          deep: '#001a40',
        }
      },
      boxShadow: {
        'neon-red': '0 0 15px rgba(229, 9, 20, 0.6), 0 0 30px rgba(255, 48, 48, 0.3)',
        'neon-red-lg': '0 0 25px rgba(229, 9, 20, 0.8), 0 0 50px rgba(255, 48, 48, 0.4)',
        'evileye': '0 0 20px rgba(0, 210, 255, 0.9), 0 0 40px rgba(0, 102, 255, 0.6)',
        'cyber-card': '0 4px 20px -2px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(229, 9, 20, 0.25)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spider-swing': 'spiderSwing 3.5s ease-in-out infinite alternate',
        'grid-scroll': 'gridScroll 20s linear infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', filter: 'drop-shadow(0 0 15px rgba(229,9,20,0.8))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(255,48,48,1))' },
        },
        spiderSwing: {
          '0%': { transform: 'rotate(-12deg) translateY(0px)' },
          '50%': { transform: 'rotate(0deg) translateY(6px)' },
          '100%': { transform: 'rotate(12deg) translateY(0px)' },
        },
        gridScroll: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
