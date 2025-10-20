'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { categoriesAPI, Movie } from '@/lib/neoApi';
import { useTranslation } from '@/contexts/TranslationContext';
import MovieCard from '@/components/MovieCard';
import { ArrowLeft, Loader2 } from 'lucide-react';

// Маппинг ID категорий к их названиям (так как нет эндпоинта getCategory)
const categoryNames: Record<number, string> = {
  12: 'приключения',
  10751: 'семейный',
  10752: 'военный',
  10762: 'Детский',
  10764: 'Реалити-шоу',
  10749: 'мелодрама',
  28: 'боевик',
  80: 'криминал',
  18: 'драма',
  14: 'фэнтези',
  27: 'ужасы',
  10402: 'музыка',
  10770: 'телевизионный фильм',
  16: 'мультфильм',
  99: 'документальный',
  878: 'фантастика',
  37: 'вестерн',
  10765: 'НФ и Фэнтези',
  10767: 'Ток-шоу',
  10768: 'Война и Политика',
  9648: 'детектив',
  35: 'комедия',
  36: 'история',
  53: 'триллер',
  10759: 'Боевик и Приключения',
  10763: 'Новости',
  10766: 'Мыльная опера'
};

function CategoryPage() {
  const { t, locale } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const categoryId = parseInt(params.id as string);

  const [categoryName, setCategoryName] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Устанавливаем название категории из переводов
    if (categoryId && t.categories.names[categoryId as keyof typeof t.categories.names]) {
      setCategoryName(t.categories.names[categoryId as keyof typeof t.categories.names]);
    } else {
      setCategoryName(t.categories.unknownCategory);
    }
  }, [categoryId]);

  useEffect(() => {
    async function fetchData() {
      if (!categoryId) return;

      setLoading(true);
      setError(null);

      try {
        // Выбираем источник по языку: ru -> kp, иначе tmdb
        const source = (locale || 'ru') === 'ru' ? 'kp' : 'tmdb';
        // Получаем и фильмы, и сериалы, объединяем, чтобы не было пустых категорий
        const [tvRes, movieRes]: any = await Promise.all([
          categoriesAPI.getMediaByCategory(categoryId, 'tv', page, undefined, source, t.categories?.names?.[categoryId as any] ?? ''),
          categoriesAPI.getMediaByCategory(categoryId, 'movie', page, undefined, source, t.categories?.names?.[categoryId as any] ?? '')
        ]);
        const tvItems = tvRes?.results || [];
        const movieItems = movieRes?.results || [];
        const combined = [...tvItems, ...movieItems];
        setMovies(combined);
        setTotalPages(Math.max(tvRes?.total_pages || 1, movieRes?.total_pages || 1));
      } catch (err) {
        setError(t.categories.errorLoadingMovies);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [categoryId, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const Pagination = useMemo(() => {
    if (totalPages <= 1) return null;

    const pageButtons = [];
    const maxPagesToShow = 5;
    let startPage: number;
    let endPage: number;

    if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
    } else {
        const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
        const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;
        if (page <= maxPagesBeforeCurrent) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (page + maxPagesAfterCurrent >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = page - maxPagesBeforeCurrent;
            endPage = page + maxPagesAfterCurrent;
        }
    }

    // Previous button
    pageButtons.push(
      <button key="prev" onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-3 py-1 rounded-md bg-card hover:bg-card/80 disabled:opacity-50 disabled:cursor-not-allowed">
        &lt;
      </button>
    );

    if (startPage > 1) {
        pageButtons.push(<button key={1} onClick={() => handlePageChange(1)} className="px-3 py-1 rounded-md bg-card hover:bg-card/80">1</button>);
        if (startPage > 2) {
            pageButtons.push(<span key="dots1" className="px-3 py-1">...</span>);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button key={i} onClick={() => handlePageChange(i)} disabled={page === i} className={`px-3 py-1 rounded-md ${page === i ? 'bg-accent text-white' : 'bg-card hover:bg-card/80'}`}>
          {i}
        </button>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(<span key="dots2" className="px-3 py-1">...</span>);
      }
      pageButtons.push(<button key={totalPages} onClick={() => handlePageChange(totalPages)} className="px-3 py-1 rounded-md bg-card hover:bg-card/80">{totalPages}</button>);
    }

    // Next button
    pageButtons.push(
      <button key="next" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="px-3 py-1 rounded-md bg-card hover:bg-card/80 disabled:opacity-50 disabled:cursor-not-allowed">
        &gt;
      </button>
    );

    return <div className="flex justify-center items-center gap-2 my-8 text-foreground">{pageButtons}</div>;
  }, [page, totalPages]);


  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground w-full px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 mb-4 px-4 py-2 rounded-md bg-card hover:bg-card/80 text-foreground">
          <ArrowLeft size={16} />
          {t.common.backToCategories}
        </button>
        <div className="text-red-500 text-center p-8 bg-red-500/10 rounded-lg my-8">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground w-full px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 mb-4 px-4 py-2 rounded-md bg-card hover:bg-card/80 text-foreground">
        <ArrowLeft size={16} />
        Назад к категориям
      </button>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground capitalize">
        {categoryName}
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="w-12 h-12 animate-spin text-accent" />
        </div>
      ) : (
        <>
          {movies.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
              {movies.map(movie => (
                <MovieCard
                  key={`movie-${movie.id}-${page}`}
                  movie={movie}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p>{t.categories.noMoviesInCategory}</p>
            </div>
          )}
          
          {Pagination}
        </>
      )}
    </div>
  );
}

export default CategoryPage;
