'use client';

import { useRouter } from 'next/navigation';

export default function Terms() {
  const router = useRouter();

  const handleAccept = () => {
    localStorage.setItem('acceptedTerms', 'true');
    router.push('/');
  };

  const handleDecline = () => {
    localStorage.setItem('acceptedTerms', 'false');
    alert('Вы не можете использовать сайт без согласия с условиями.');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-4xl bg-warm-50 dark:bg-warm-900 rounded-lg shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Пользовательское соглашение Neo Movies</h1>
          <p className="mt-2 text-muted-foreground">Пожалуйста, внимательно ознакомьтесь с условиями использования</p>
        </div>
        
        {/* Content */}
        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-4 text-muted-foreground">
          <p>Благодарим вас за интерес к сервису Neo Movies. Пожалуйста, ознакомьтесь с нашими условиями использования перед началом работы.</p>
          
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Общие положения</h2>
            <p>Использование сайта NeoMovies (<a href="https://neo-movies.vercel.app" target="_blank" className="text-accent hover:underline">https://neo-movies.vercel.app</a>) возможно только при полном согласии с условиями настоящего Пользовательского соглашения. Несогласие с любыми положениями соглашения означает, что вы не имеете права использовать данный сайт и должны прекратить доступ к нему.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Описание сервиса</h2>
            <p>NeoMovies предоставляет доступ к информации о фильмах и сериалах с использованием API TMDB. Видео воспроизводятся с использованием сторонних видеохостингов и балансеров. Сайт <strong>не хранит и не распространяет</strong> видеофайлы. Мы выступаем исключительно в роли посредника между пользователем и внешними сервисами.</p>
            <p>Некоторая информация о доступности контента также может быть получена из общедоступных децентрализованных источников, включая magnet-ссылки. Сайт не распространяет файлы и не является участником пиринговых сетей.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Ответственность</h2>
            <p>Сайт не несёт ответственности за:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>точность или легальность предоставленного сторонними плеерами контента;</li>
              <li>возможные нарушения авторских прав со стороны балансеров;</li>
              <li>действия пользователей, связанные с просмотром, загрузкой или распространением контента.</li>
            </ul>
            <p>Вся ответственность за использование контента лежит исключительно на пользователе. Использование сторонних источников осуществляется на ваш собственный риск.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Регистрация и персональные данные</h2>
            <p>Сайт собирает только минимальный набор данных: имя, email и пароль — исключительно для сохранения избранного. Пароли шифруются и хранятся безопасно. Мы не передаём ваши данные третьим лицам и не используем их в маркетинговых целях.</p>
            <p>Исходный код сайта полностью открыт и доступен для проверки в <a href="https://gitlab.com/foxixus/neomovies" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">публичном репозитории</a>, что обеспечивает максимальную прозрачность и возможность независимого аудита безопасности и обработки данных.</p>
            <p>Пользователь подтверждает, что ему <strong>исполнилось 16 лет</strong> либо он получил разрешение от законного представителя.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Изменения в соглашении</h2>
            <p>Мы оставляем за собой право вносить изменения в настоящее соглашение. Продолжение использования сервиса после внесения изменений означает ваше согласие с обновлёнными условиями.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Заключительные положения</h2>
            <p>Настоящее соглашение вступает в силу с момента вашего согласия с его условиями и действует бессрочно.</p>
            <p>Если вы не согласны с какими-либо положениями данного соглашения, вы должны немедленно прекратить использование сервиса.</p>
          </section>
        </div>
        
        {/* Actions */}
        <div className="pt-6 border-t border-warm-200 dark:border-warm-700 mt-8">
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              onClick={handleDecline}
              className="px-6 py-3 border border-warm-200 dark:border-warm-700 text-base font-medium rounded-lg bg-white dark:bg-warm-800 hover:bg-warm-100 dark:hover:bg-warm-700 text-foreground transition-colors"
            >
              Отклонить
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
              Принимаю условия
            </button>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>© 2025 Neo Movies. Все права защищены.</p>
      </footer>
    </div>
  );
}
