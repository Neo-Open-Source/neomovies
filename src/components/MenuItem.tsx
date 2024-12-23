'use client';

import styled from 'styled-components';
import Link from 'next/link';

interface MenuItemProps {
  href?: string;
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const StyledMenuItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  text-decoration: none;
  border-radius: 8px;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  svg {
    width: 20px;
    height: 20px;
    opacity: ${props => props.$active ? 1 : 0.7};
  }
`;

const ItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Label = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SubLabel = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default function MenuItem({ href, icon, label, subLabel, isActive, onClick }: MenuItemProps) {
  const content = (
    <StyledMenuItem $active={isActive} onClick={onClick}>
      {icon}
      <ItemContent>
        <Label>{label}</Label>
        {subLabel && <SubLabel>{subLabel}</SubLabel>}
      </ItemContent>
    </StyledMenuItem>
  );

  if (href) {
    return (
      <Link href={href} passHref style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        {content}
      </Link>
    );
  }

  return content;
}
