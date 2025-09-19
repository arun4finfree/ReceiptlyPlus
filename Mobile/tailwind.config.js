/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Mobile-optimized color palette
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        }
      },
      // Mobile-optimized spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Mobile-optimized font sizes
      fontSize: {
        'mobile-xs': ['12px', '16px'],
        'mobile-sm': ['14px', '20px'],
        'mobile-base': ['16px', '24px'],
        'mobile-lg': ['18px', '28px'],
        'mobile-xl': ['20px', '28px'],
        'mobile-2xl': ['24px', '32px'],
        'mobile-3xl': ['30px', '36px'],
      },
      // Mobile-optimized breakpoints
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Mobile-optimized animations
      animation: {
        'mobile-fade-in': 'mobile-fade-in 0.3s ease-out',
        'mobile-slide-up': 'mobile-slide-up 0.3s ease-out',
        'mobile-bounce': 'mobile-bounce 1s ease-in-out',
        'mobile-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      // Mobile-optimized keyframes
      keyframes: {
        'mobile-fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'mobile-slide-up': {
          '0%': {
            transform: 'translateY(100%)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
        'mobile-bounce': {
          '0%, 20%, 53%, 80%, 100%': {
            transform: 'translate3d(0, 0, 0)',
          },
          '40%, 43%': {
            transform: 'translate3d(0, -8px, 0)',
          },
          '70%': {
            transform: 'translate3d(0, -4px, 0)',
          },
          '90%': {
            transform: 'translate3d(0, -2px, 0)',
          },
        },
      },
      // Mobile-optimized box shadows
      boxShadow: {
        'mobile-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'mobile': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'mobile-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'mobile-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'mobile-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      // Mobile-optimized border radius
      borderRadius: {
        'mobile': '0.5rem',
        'mobile-lg': '0.75rem',
        'mobile-xl': '1rem',
      },
      // Mobile-optimized z-index
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [
    // Mobile-optimized plugins
    function({ addUtilities, addComponents, theme }) {
      // Mobile-specific utilities
      addUtilities({
        '.touch-target': {
          'min-height': '44px',
          'min-width': '44px',
        },
        '.mobile-scroll': {
          '-webkit-overflow-scrolling': 'touch',
        },
        '.mobile-select-none': {
          '-webkit-user-select': 'none',
          '-moz-user-select': 'none',
          '-ms-user-select': 'none',
          'user-select': 'none',
        },
        '.mobile-tap-highlight': {
          '-webkit-tap-highlight-color': 'transparent',
        },
      });

      // Mobile-specific components
      addComponents({
        '.mobile-input': {
          'width': '100%',
          'padding': '0.75rem 1rem',
          'border': '1px solid #d1d5db',
          'border-radius': '0.5rem',
          'font-size': '16px', // Prevent zoom on iOS
          'min-height': '44px',
          '&:focus': {
            'outline': 'none',
            'ring': '2px',
            'ring-color': '#3b82f6',
            'border-color': '#3b82f6',
          },
        },
        '.mobile-btn': {
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.5rem',
          'font-weight': '500',
          'font-size': '16px',
          'min-height': '44px',
          'transition': 'all 0.2s ease-in-out',
          '&:focus': {
            'outline': 'none',
            'ring': '2px',
          },
        },
        '.mobile-card': {
          'background-color': '#ffffff',
          'border-radius': '0.5rem',
          'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          'padding': '1.5rem',
          'transition': 'box-shadow 0.2s ease-in-out',
          '&:hover': {
            'box-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
        '.mobile-modal': {
          'position': 'fixed',
          'inset': '0',
          'background-color': 'rgba(0, 0, 0, 0.5)',
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          'padding': '1rem',
          'z-index': '50',
          '-webkit-overflow-scrolling': 'touch',
        },
      });
    }
  ],
}


