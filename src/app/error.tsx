'use client';

import { useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  /* Add styles here */
`;

const Title = styled.h1`
  /* Add styles here */
`;

const Description = styled.p`
  /* Add styles here */
`;

const Button = styled.button`
  /* Add styles here */
`;

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container>
      <Title>Что-то пошло не так!</Title>
      <Description>
        Произошла ошибка при загрузке страницы. Попробуйте обновить страницу.
      </Description>
      <Button onClick={() => window.location.reload()}>
        Обновить страницу
      </Button>
    </Container>
  );
}
