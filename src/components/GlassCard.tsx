import styled from 'styled-components';

export const GlassCard = styled.div`
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  margin: 0 auto;
`;

export default GlassCard;
