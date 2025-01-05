import { useState, useEffect } from 'react';
import { getImageUrl } from '@/lib/neoApi';

export type ImageSize = 'w500' | 'original' | 'w780' | 'w342' | 'w185' | 'w92';

export function useImageLoader(path: string | null, size: ImageSize = 'w500') {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('/placeholder.jpg');

  useEffect(() => {
    if (!path) {
      setImageUrl('/placeholder.jpg');
      setIsLoading(false);
      return;
    }

    const url = getImageUrl(path, size);
    setImageUrl(url);

    const img = new Image();
    img.src = url;

    img.onload = () => {
      setIsLoading(false);
      setError(null);
    };

    img.onerror = (e) => {
      setIsLoading(false);
      setError(e as Error);
      setImageUrl('/placeholder.jpg');
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [path, size]);

  return { isLoading, error, imageUrl };
}
