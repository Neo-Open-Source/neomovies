import styled from 'styled-components';

export const GlassCard = styled.div`
  background: rgba(0, 0, 0, 0.65); /* Увеличили непрозрачность фона для лучшей читаемости */
  /* Убираем тяжелый blur на мобильных устройствах */
  @supports (backdrop-filter: blur(20px)) {
    backdrop-filter: blur(20px);
    background: rgba(0, 0, 0, 0.45);
  }
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2.5rem;
  border-radius: 16px; /* Уменьшили радиус для компактности */
  width: 100%;
  max-width: 500px;
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  margin: 0 auto;
  overflow: hidden; /* Предотвращаем выход контента за пределы карточки */
  
  @media (max-width: 640px) {
    padding: 1.75rem 1.5rem;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1.25rem;
    margin: 0 0.5rem;
    width: calc(100% - 1rem);
  }
`;

export default GlassCard;
