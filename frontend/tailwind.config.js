/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette cyberpunk/aquatique
        'deep-blue': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49'
        },
        'cyber-cyan': {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344'
        },
        'dark-slate': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        }
      },
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'tech': ['Rajdhani', 'sans-serif']
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite alternate'
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px #06b6d4, 0 0 10px #06b6d4, 0 0 15px #06b6d4',
            textShadow: '0 0 5px #06b6d4'
          },
          '100%': { 
            boxShadow: '0 0 10px #22d3ee, 0 0 20px #22d3ee, 0 0 30px #22d3ee',
            textShadow: '0 0 10px #22d3ee'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' }
        }
      },
      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c4a6e 100%)',
        'gradient-glow': 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1) 0%, transparent 70%)'
      }
    },
  },
  plugins: [],
}