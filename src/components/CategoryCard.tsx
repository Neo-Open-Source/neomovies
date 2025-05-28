'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Category } from '@/lib/api';

interface CategoryCardProps {
  category: Category;
  backgroundUrl?: string;
}

// Словарь цветов для разных жанров
const genreColors: Record<number, string> = {
  28: '#E53935', // Боевик - красный
  12: '#43A047', // Приключения - зеленый
  16: '#FB8C00', // Мультфильм - оранжевый
  35: '#FFEE58', // Комедия - желтый
  80: '#424242', // Криминал - темно-серый
  99: '#8D6E63', // Документальный - коричневый
  18: '#5E35B1', // Драма - пурпурный
  10751: '#EC407A', // Семейный - розовый
  14: '#7E57C2', // Фэнтези - фиолетовый
  36: '#795548', // История - коричневый
  27: '#212121', // Ужасы - черный
  10402: '#26A69A', // Музыка - бирюзовый
  9648: '#5C6BC0', // Детектив - индиго
  10749: '#EC407A', // Мелодрама - розовый
  878: '#00BCD4', // Фантастика - голубой
  10770: '#9E9E9E', // ТВ фильм - серый
  53: '#FFA000', // Триллер - янтарный
  10752: '#455A64', // Военный - сине-серый
  37: '#8D6E63', // Вестерн - коричневый
  // Добавим цвета для популярных жанров сериалов
  10759: '#1E88E5', // Боевик и приключения - синий
  10762: '#00ACC1', // Детский - циан
  10763: '#546E7A', // Новости - сине-серый
  10764: '#F06292', // Реалити-шоу - розовый
  10765: '#00BCD4', // Фантастика и фэнтези - голубой
  10766: '#5E35B1', // Мыльная опера - пурпурный
  10767: '#4CAF50', // Ток-шоу - зеленый
  10768: '#FFD54F'  // Война и политика - желтый
};

// Получаем цвет для категории или используем запасной вариант
function getCategoryColor(categoryId: number): string {
  return genreColors[categoryId] || '#3949AB'; // Индиго как запасной вариант
}

const CardContainer = styled.div<{ $bgUrl: string; $bgColor: string }>`
  position: relative;
  width: 100%;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-image: url(${props => props.$bgUrl || '/images/placeholder.jpg'});
  background-size: cover;
  background-position: center;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.$bgColor};
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    
    &::after {
      opacity: 0.8;
    }
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 1rem;
  color: white;
  text-align: center;
`;

const CategoryName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const CategoryCount = styled.p`
  font-size: 0.875rem;
  opacity: 0.9;
  margin: 0.5rem 0 0;
`;

function CategoryCard({ category, backgroundUrl }: CategoryCardProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>(backgroundUrl || '/images/placeholder.jpg');
  
  const categoryColor = getCategoryColor(category.id);
  
  function handleClick() {
    router.push(`/categories/${category.id}`);
  }
  
  return (
    <CardContainer 
      $bgUrl={imageUrl} 
      $bgColor={categoryColor}
      onClick={handleClick}
      role="button"
      aria-label={`Категория ${category.name}`}
    >
      <CardContent>
        <CategoryName>{category.name}</CategoryName>
        <CategoryCount>Фильмы и сериалы</CategoryCount>
      </CardContent>
    </CardContainer>
  );
}

export default CategoryCard;
