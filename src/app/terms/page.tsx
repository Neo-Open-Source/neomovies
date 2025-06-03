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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-700">
          {/* Header */}
          <div className="bg-indigo-700 px-6 py-8 text-center border-b border-indigo-600">
            <h1 className="text-3xl font-bold text-white">Пользовательское соглашение Neo Movies</h1>
            <p className="mt-2 text-indigo-200">Пожалуйста, внимательно ознакомьтесь с условиями использования</p>
          </div>
          
          {/* Content */}
          <div className="p-6 md:p-8 space-y-6 text-gray-300">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-gray-200">Благодарим вас за интерес к сервису Neo Movies. Пожалуйста, ознакомьтесь с нашими условиями использования перед началом работы.</p>
              
              <div className="mt-8 space-y-6">
                <section className="border-b border-gray-700 pb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">1. Общие положения</h2>
                  <p>Использование сайта NeoMovies (<a href="https://neo-movies.vercel.app" target="_blank">https://neo-movies.vercel.app</a>) возможно только при полном согласии с условиями настоящего Пользовательского соглашения. Несогласие с любыми положениями соглашения означает, что вы не имеете права использовать данный сайт и должны прекратить доступ к нему.</p>
                </section>

                <section className="border-b border-gray-700 pb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">2. Описание сервиса</h2>
                  <p>NeoMovies предоставляет доступ к информации о фильмах и сериалах с использованием API TMDB. Видео воспроизводятся с использованием сторонних видеохостингов и балансеров. Сайт <strong>не хранит и не распространяет</strong> видеофайлы. Мы выступаем исключительно в роли посредника между пользователем и внешними сервисами.</p>
                </section>

                <section className="border-b border-gray-700 pb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">3. Ответственность</h2>
                  <p>Сайт не несёт ответственности за:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>точность или легальность предоставленного сторонними плеерами контента;</li>
                    <li>возможные нарушения авторских прав со стороны балансеров;</li>
                    <li>действия пользователей, связанные с просмотром, загрузкой или распространением контента.</li>
                  </ul>
                  <p>Вся ответственность за использование контента лежит исключительно на пользователе. Использование сторонних источников осуществляется на ваш собственный риск.</p>
                </section>

                <section className="border-b border-gray-700 pb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">4. Регистрация и персональные данные</h2>
                  <p>Сайт собирает только минимальный набор данных: имя, email и пароль — исключительно для сохранения избранного. Пароли шифруются и хранятся безопасно. Мы не передаём ваши данные третьим лицам и не используем их в маркетинговых целях.</p>
                  <p>Исходный код сайта полностью открыт и доступен для проверки в <a href="https://gitlab.com/foxixus/neomovies" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">публичном репозитории</a>, что обеспечивает максимальную прозрачность и возможность независимого аудита безопасности и обработки данных.</p>
                  <p>Пользователь подтверждает, что ему <strong>исполнилось 16 лет</strong> либо он получил разрешение от законного представителя.</p>
                </section>

                <section className="border-b border-gray-700 pb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">5. Изменения в соглашении</h2>
                  <p>Мы оставляем за собой право вносить изменения в настоящее соглашение. Продолжение использования сервиса после внесения изменений означает ваше согласие с обновлёнными условиями.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">6. Заключительные положения</h2>
                  <p>Настоящее соглашение вступает в силу с момента вашего согласия с его условиями и действует бессрочно.</p>
                  <p>Если вы не согласны с какими-либо положениями данного соглашения, вы должны немедленно прекратить использование сервиса.</p>
                </section>
              </div>
            </div>
            
            {/* Actions */}
            <div className="pt-6 border-t border-gray-200 mt-8">
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                  onClick={handleDecline}
                  className="px-6 py-3 border border-gray-600 text-base font-medium rounded-lg text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Отклонить
                </button>
                <button
                  onClick={handleAccept}
                  className="px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Принимаю условия
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="mt-8 text-center text-sm text-gray-400">
          <p>© 2025 Neo Movies. Все права защищены.</p>
        </footer>
      </div>
    </div>
  );
}
