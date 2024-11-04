import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
        xl: '1280px',
      },
    },
    extend: {
      screens: {
        '2xl': '1400px',
        xxl: '1500px',
        md: '1200px',
        sb: '1024px',
        sm: '900px',
        nm: '800px',
        xs: '300px',
        ms: '550px',
      },
      backgroundImage: {
        'gradient-radial':
          'linear-gradient(rgba(58, 77, 221, 1),rgba(66, 215, 197, 1))',
        'primary-bg': 'url(/assets/bg-net.svg)',
      },
      gridTemplateColumns: {
        '33': 'repeat(3, minmax(0, 300px))',
        '23': 'repeat(2, minmax(0, 300px))',
        '13': 'repeat(1, minmax(0, 300px))',
        'small-four': 'repeat(4, minmax(0, 255px))',
        'small-three': 'repeat(3, minmax(0, 255px))',
        'small-two': 'repeat(2, minmax(0, 255px))',
        'small-one': 'repeat(1, minmax(0, 100%))',
      },
      colors: {
        gradient: 'linear-gradient(rgba(58, 77, 221, 1),rgba(66, 215, 197, 1))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        gradientBlue: 'rgba(58, 77, 221, 1)',
        gradientLightBlue: 'rgba(66, 215, 197, 1)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: '#3A4DDD',
        darkGray: '#474F69',
        gray: '#63697D',
        backgroundGray: '#F6F7F8',
        error: '#DE0707',
        lightError: '#FFEEEE',
        green: '#2A6445',
        lightGreen: '#DCFFEF',
        yellow: '#915700',
        lightYellow: '#FBFFD0',
        lightGray: '#DDDFE4',
        layoutBg: '#F1F1F1',
        online: '#31C149',
        lightPrimary: '#E8EFFE',
        secondaryBlue: '#5968D4',
        pastelRed: '#DE0707',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      dropShadow: {
        normal: 'filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.05));',
        medium: [
          '2px 2px 5px rgba(0, 0, 0, 0.05)',
          '2px 2px 5px rgba(0, 0, 0, 0.05)',
        ],
      },
      boxShadow: {
        medium: '0px 4px 12px 0px rgb(0 0 0 / 10%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        poppins: 'var(--font-poppins)',
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
