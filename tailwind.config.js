/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/react-app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          red: '#FF1744',
          white: '#FFFFFF',
          silver: '#C0C0C0',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { 
            textShadow: '0 0 10px #FF1744, 0 0 20px #FF1744, 0 0 30px #FF1744',
            filter: 'drop-shadow(0 0 10px #FF1744)',
          },
          '50%': { 
            textShadow: '0 0 20px #FF1744, 0 0 40px #FF1744, 0 0 60px #FF1744',
            filter: 'drop-shadow(0 0 20px #FF1744)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};
