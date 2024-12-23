'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Отключаем стили Dark Reader для определенных элементов */
  *[data-darkreader-mode],
  *[data-darkreader-scheme] {
    background-color: unset !important;
    color: unset !important;
  }

  /* Сбрасываем инлайн-стили Dark Reader */
  *[style*="--darkreader-inline"] {
    background-color: unset !important;
    color: unset !important;
    border-color: unset !important;
    fill: unset !important;
  }
`;

export default GlobalStyles;
