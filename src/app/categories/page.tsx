'use client';

import { useState, useEffect } from 'react';
import { categoriesAPI, Category } from '@/lib/neoApi';
import CategoryCard from '@/components/CategoryCard';
import { useTranslation } from '@/contexts/TranslationContext';

interface CategoryWithBackground extends Category {
  backgroundUrl?: string | null;
}

function CategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<CategoryWithBackground[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategoriesAndBackgrounds() {
      setError(null);
      setLoading(true);
      
      try {
        const categoriesResponse = await categoriesAPI.getCategories();
        
        if (!categoriesResponse.data || categoriesResponse.data.length === 0) {
          setError('Не удалось загрузить категории');
          setLoading(false);
          return;
        }
        
        const categoriesWithBackgrounds: CategoryWithBackground[] = await Promise.all(
          categoriesResponse.data.map(async (category: Category) => {
            try {
              // Пробуем получить сериал как фон, иначе фильм
              const tvRes: any = await categoriesAPI.getMediaByCategory(category.id, 'tv', 1);
              const movieRes: any = await categoriesAPI.getMediaByCategory(category.id, 'movie', 1);
              const pick = tvRes?.results?.[0] || movieRes?.results?.[0];
              const backgroundUrl = pick?.backdrop_path || pick?.poster_path || null;
              return { ...category, backgroundUrl };
            } catch (error) {
              console.error(`Error fetching background for category ${category.id}:`, error);
              return { ...category, backgroundUrl: null };
            }
          })
        );
        
        setCategories(categoriesWithBackgrounds);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(t.categories.errorLoadingCategories);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategoriesAndBackgrounds();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Категории</h1>
          <div className="text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/50 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Категории</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Выберите категорию для просмотра фильмов
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                category={category}
                backgroundUrl={category.backgroundUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoriesPage;
