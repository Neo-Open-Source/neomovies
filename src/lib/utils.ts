export const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const formatDate = (dateString: string | Date | undefined | null) => {
  if (!dateString) return 'Нет даты';
  
  // Если это строка и она уже содержит "г." (формат с API), возвращаем как есть
  if (typeof dateString === 'string' && dateString.includes(' г.')) {
    return dateString;
  }
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (isNaN(date.getTime())) {
      return 'Нет даты';
    }

    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date) + ' г.';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Нет даты';
  }
};
