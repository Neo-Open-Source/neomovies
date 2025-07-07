import { DefaultTheme } from 'styled-components';

// Calm warm palette: sand / clay / terracotta accents

export const theme: DefaultTheme = {
  colors: {
    background: '#faf5f0',       // light warm background for light mode
    surface: '#fff8f3',          // card/background surfaces
    surfaceDark: '#1e1a16',      // dark mode surface
    text: '#2c261f',             // primary text
    textSecondary: '#6d6257',    // secondary text
    primary: '#e04e39',          // warm red-orange accent (buttons)
    primaryHover: '#c74430',
    secondary: '#f9c784',        // mellow orange highlight
    border: '#e9ded7',
  },
  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
  },
  spacing: (n: number) => `${n * 4}px`,
};

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      surface: string;
      surfaceDark: string;
      text: string;
      textSecondary: string;
      primary: string;
      primaryHover: string;
      secondary: string;
      border: string;
    };
    radius: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
    spacing: (n: number) => string;
  }
}
