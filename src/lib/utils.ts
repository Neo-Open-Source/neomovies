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
    let date: Date;
    
    if (typeof dateString === 'string') {
      // Пробуем разные форматы даты
      if (dateString.includes('T')) {
        // ISO формат
        date = new Date(dateString);
      } else if (dateString.includes('-')) {
        // YYYY-MM-DD формат
        const [year, month, day] = dateString.split('-').map(Number);
        date = new Date(year, month - 1, day);
      } else if (dateString.includes('.')) {
        // DD.MM.YYYY формат
        const [day, month, year] = dateString.split('.').map(Number);
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(dateString);
      }
    } else {
      date = dateString;
    }
    
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'Нет даты';
    }

    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date) + ' г.';
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return 'Нет даты';
  }
};
