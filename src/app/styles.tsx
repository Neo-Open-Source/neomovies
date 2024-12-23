'use client';

import styled from 'styled-components';

export const MainContent = styled.main`
  margin-left: 240px;
  min-height: 100vh;
  padding: 2rem;
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding-top: 4rem;
  }
`;
