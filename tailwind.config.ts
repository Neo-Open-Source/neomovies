import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        warm: {
          50:  '#fdf9f4',
          100: '#faf5f0',
          200: '#f2e6d9',
          300: '#e9d6c2',
          400: '#e0c6aa',
          500: '#d7b792',
          600: '#c49f71',
          700: '#a67f55',
          800: '#886040',
          900: '#66452e',
        },
        accent: '#e04e39',
      },
      borderRadius: {
        md: '8px',
        lg: '12px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-30px, 30px)' },
        }
      },
      animation: {
        'float': 'float 20s infinite ease-in-out',
        'float-delayed': 'float 20s infinite ease-in-out -5s',
        'float-more-delayed': 'float 20s infinite ease-in-out -10s',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': {
          '--background': '#fdf9f4', // warm-50
          '--foreground': '#2c261f', // warm-900
        },
        '.dark': {
          '--background': '#1c1c1c', // A dark gray
          '--foreground': '#f2e6d9', // warm-200
        },
        body: {
          '@apply bg-background text-foreground antialiased': {},
        },
      });
    }),
  ],
} satisfies Config;
