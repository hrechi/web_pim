import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

/**
 * Fieldly web — design tokens mirror the Flutter mobile app
 * (frontend_pim/lib/theme/color_palette.dart).
 */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Brand palette — exact hex codes from mobile app
        primary: {
          DEFAULT: '#309448',
          50: '#EAF7EE',
          100: '#CFEBD7',
          200: '#A6D9B5',
          300: '#7CC793',
          400: '#52B571',
          500: '#309448',
          600: '#28793B',
          700: '#1F5E2E',
          800: '#174422',
          900: '#0E2A15',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#2ECC71',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#1ABC9C',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#1DB954',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#729944',
          foreground: '#FFFFFF',
        },
        info: {
          DEFAULT: '#00F260',
          foreground: '#0E2A15',
        },
        danger: {
          DEFAULT: '#FF4B2B',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#FF4B2B',
          foreground: '#FFFFFF',
        },
        glow: '#AFFE00',

        // Surfaces / neutrals
        bg: '#FAF7F2',
        background: '#FAF7F2',
        surface: '#FFFFFF',
        ink: '#2C3E2D',
        foreground: '#2C3E2D',
        muted: {
          DEFAULT: '#ECF0F1',
          foreground: '#7F8C8D',
        },
        border: '#E5E1D8',
        input: '#E5E1D8',
        ring: '#309448',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#2C3E2D',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#2C3E2D',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      fontSize: {
        // Mirrors mobile text scale
        'display': ['32px', { lineHeight: '1.15', letterSpacing: '-0.5px', fontWeight: '700' }],
        'h1': ['28px', { lineHeight: '1.2', letterSpacing: '-0.4px', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.25', letterSpacing: '-0.3px', fontWeight: '700' }],
        'h3': ['20px', { lineHeight: '1.3', letterSpacing: '-0.2px', fontWeight: '600' }],
        'h4': ['18px', { lineHeight: '1.35', fontWeight: '600' }],
      },
      borderRadius: {
        lg: '16px',
        md: '12px',
        sm: '8px',
        xl: '20px',
        '2xl': '24px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(44,62,45,0.04), 0 4px 16px rgba(44,62,45,0.05)',
        card: '0 2px 4px rgba(44,62,45,0.04), 0 8px 24px rgba(44,62,45,0.06)',
        glow: '0 0 0 4px rgba(48,148,72,0.18)',
      },
      backgroundImage: {
        'gradient-field': 'linear-gradient(135deg, #2ECC71 0%, #27AE60 50%, #3498DB 100%)',
        'gradient-robot': 'linear-gradient(135deg, #1ABC9C 0%, #00D2FF 100%)',
        'gradient-success': 'linear-gradient(135deg, #1DB954 0%, #2ECC71 100%)',
        'gradient-alert': 'linear-gradient(135deg, #FF4B2B 0%, #FF6B6B 100%)',
        'gradient-brand': 'linear-gradient(135deg, #309448 0%, #1ABC9C 100%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(48,148,72,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(48,148,72,0)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-zoom': {
          '0%': { opacity: '0', transform: 'scale(1.08)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'blob': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.25s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'fade-up': 'fade-up 0.7s ease-out both',
        'fade-down': 'fade-down 0.5s ease-out both',
        'slide-zoom': 'slide-zoom 1.2s ease-out both',
        'shimmer': 'shimmer 2.5s linear infinite',
        'blob': 'blob 12s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
