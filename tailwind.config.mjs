/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        duo: {
          green: '#58CC02',
          greenDark: '#46A302',
          blue: '#1CB0F6',
          blueDark: '#1899D6',
          purple: '#A572F7',
          purpleDark: '#8F5FD4',
          red: '#FF4B4B',
          yellow: '#FFC800',
          orange: '#FF9600',
          pink: '#FF85C2',
          gold: '#FFD700',
        },
        apple: {
          gray: '#F5F5F7',
          gray1: '#FBFBFD',
          gray2: '#F5F5F7',
          gray3: '#E5E5EA',
          gray4: '#D1D1D6',
          gray5: '#C7C7CC',
          gray6: '#8E8E93',
          dark1: '#1C1C1E',
          dark2: '#2C2C2E',
          dark3: '#3A3A3C',
          dark4: '#48484A',
          dark5: '#636366',
          dark6: '#8E8E93',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'apple': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'apple-lg': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'apple-xl': '0 12px 48px rgba(0, 0, 0, 0.12)',
        'apple-dark': '0 4px 24px rgba(0, 0, 0, 0.3)',
        'glow-green': '0 0 40px rgba(88, 204, 2, 0.3)',
        'glow-blue': '0 0 40px rgba(28, 176, 246, 0.3)',
      },
      borderRadius: {
        'apple': '20px',
        'apple-lg': '28px',
        'apple-xl': '36px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};
