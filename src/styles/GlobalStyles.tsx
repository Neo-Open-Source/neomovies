'use client';

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body {
    max-width: 100vw;
    min-height: 100vh;
    overflow-x: hidden;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  input, button, textarea, select {
    font: inherit;
  }

  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  #__next {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Скрываем уведомления об ошибках Next.js */
  .nextjs-toast-errors-parent {
    display: none !important;
  }

  /* Скрываем все toast-уведомления Next.js */
  div[id^='__next-build-watcher'],
  div[class^='nextjs-toast'] {
    display: none !important;
  }
`;
