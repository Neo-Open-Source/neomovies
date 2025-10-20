'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';

export default function Terms() {
  const router = useRouter();
  const [lang, setLang] = useState<'ru' | 'en'>('ru');

  const handleLanguageChange = (newLang: 'ru' | 'en') => {
    setLang(newLang);
  };

  const handleAccept = () => {
    localStorage.setItem('acceptedTerms', 'true');
    router.push('/');
  };

  const handleDecline = () => {
    localStorage.setItem('acceptedTerms', 'false');
    alert(lang === 'ru' 
      ? 'Вы не можете использовать сайт без согласия с условиями.'
      : 'You cannot use the site without agreeing to the terms.');
  };

  const content = {
    ru: {
      title: 'Пользовательское соглашение Neo Movies',
      subtitle: 'Пожалуйста, внимательно ознакомьтесь с условиями использования',
      selectLanguage: 'Выберите язык / Select Language',
      accept: 'Принимаю условия',
      decline: 'Отклонить',
      footer: '© 2025 Neo Movies. Все права защищены.',
      sections: [
        {
          title: '1. Общие положения',
          text: 'Использование сайта NeoMovies (https://neo-movies.vercel.app, https://neomovies.ru) возможно только при полном согласии с условиями настоящего Пользовательского соглашения. Несогласие с любыми положениями соглашения означает, что вы не имеете права использовать данный сайт и должны прекратить доступ к нему.'
        },
        {
          title: '2. Описание сервиса',
          text: 'NeoMovies предоставляет доступ к информации о фильмах и сериалах с использованием API TMDB. Видео воспроизводятся с использованием сторонних видеохостингов и балансеров. Сайт не хранит и не распространяет видеофайлы. Мы выступаем исключительно в роли посредника между пользователем и внешними сервисами.\n\nНекоторая информация о доступности контента также может быть получена из общедоступных децентрализованных источников, включая magnet-ссылки. Сайт не распространяет файлы и не является участником пиринговых сетей.'
        },
        {
          title: '3. Ответственность',
          text: 'Сайт не несёт ответственности за:',
          list: [
            'точность или легальность предоставленного сторонними плеерами контента;',
            'возможные нарушения авторских прав со стороны балансеров;',
            'действия пользователей, связанные с просмотром, загрузкой или распространением контента.'
          ],
          afterList: 'Вся ответственность за использование контента лежит исключительно на пользователе. Использование сторонних источников осуществляется на ваш собственный риск.'
        },
        {
          title: '4. Регистрация и персональные данные',
          text: 'Сайт собирает только минимальный набор данных: имя, email и пароль — исключительно для сохранения избранного. Пароли шифруются и хранятся безопасно. Мы не передаём ваши данные третьим лицам и не используем их в маркетинговых целях.\n\nИсходный код сайта полностью открыт и доступен для проверки в публичном репозитории, что обеспечивает максимальную прозрачность и возможность независимого аудита безопасности и обработки данных.\n\nПользователь подтверждает, что ему исполнилось 16 лет либо он получил разрешение от законного представителя.'
        },
        {
          title: '5. Изменения в соглашении',
          text: 'Мы оставляем за собой право вносить изменения в настоящее соглашение. Продолжение использования сервиса после внесения изменений означает ваше согласие с обновлёнными условиями.'
        },
        {
          title: '6. Заключительные положения',
          text: 'Настоящее соглашение вступает в силу с момента вашего согласия с его условиями и действует бессрочно.\n\nЕсли вы не согласны с какими-либо положениями данного соглашения, вы должны немедленно прекратить использование сервиса.'
        }
      ]
    },
    en: {
      title: 'Neo Movies Terms of Service',
      subtitle: 'Please read the terms of use carefully',
      selectLanguage: 'Select Language / Выберите язык',
      accept: 'Accept Terms',
      decline: 'Decline',
      footer: '© 2025 Neo Movies. All rights reserved.',
      sections: [
        {
          title: '1. General Provisions',
          text: 'Use of the NeoMovies website (https://neo-movies.vercel.app, https://neomovies.ru) is only possible with full agreement to the terms of this User Agreement. Disagreement with any provisions of the agreement means that you do not have the right to use this site and must stop accessing it.'
        },
        {
          title: '2. Service Description',
          text: 'NeoMovies provides access to information about movies and TV shows using the TMDB API. Videos are played using third-party video hosting services and load balancers. The site does not store or distribute video files. We act exclusively as an intermediary between the user and external services.\n\nSome information about content availability may also be obtained from publicly available decentralized sources, including magnet links. The site does not distribute files and is not a participant in peer-to-peer networks.'
        },
        {
          title: '3. Liability',
          text: 'The site is not responsible for:',
          list: [
            'the accuracy or legality of content provided by third-party players;',
            'possible copyright violations by load balancers;',
            'user actions related to viewing, downloading, or distributing content.'
          ],
          afterList: 'All responsibility for using the content lies solely with the user. Use of third-party sources is at your own risk.'
        },
        {
          title: '4. Registration and Personal Data',
          text: 'The site collects only a minimal set of data: name, email, and password — exclusively for saving favorites. Passwords are encrypted and stored securely. We do not share your data with third parties and do not use it for marketing purposes.\n\nThe site\'s source code is fully open and available for review in a public repository, ensuring maximum transparency and the ability for independent security and data processing audits.\n\nThe user confirms that they are at least 16 years old or have received permission from a legal guardian.'
        },
        {
          title: '5. Changes to the Agreement',
          text: 'We reserve the right to make changes to this agreement. Continued use of the service after changes are made means your acceptance of the updated terms.'
        },
        {
          title: '6. Final Provisions',
          text: 'This agreement comes into effect from the moment you agree to its terms and is valid indefinitely.\n\nIf you do not agree with any provisions of this agreement, you must immediately stop using the service.'
        }
      ]
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-4xl bg-warm-50 dark:bg-warm-900 rounded-lg shadow-lg p-8">
        
        {/* Language Selector */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <Globe className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">{t.selectLanguage}</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
          <button
            onClick={() => handleLanguageChange('ru')}
            className={`rounded-lg p-3 border-2 transition-all text-center ${
              lang === 'ru'
                ? 'border-accent bg-accent/10'
                : 'border-warm-200 dark:border-warm-700 bg-white dark:bg-warm-800 hover:border-accent/50'
            }`}
          >
            <span className="font-semibold text-foreground">Русский</span>
          </button>
          <button
            onClick={() => handleLanguageChange('en')}
            className={`rounded-lg p-3 border-2 transition-all text-center ${
              lang === 'en'
                ? 'border-accent bg-accent/10'
                : 'border-warm-200 dark:border-warm-700 bg-white dark:bg-warm-800 hover:border-accent/50'
            }`}
          >
            <span className="font-semibold text-foreground">English</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
          <p className="mt-2 text-muted-foreground">{t.subtitle}</p>
        </div>
        
        {/* Content */}
        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-4 text-muted-foreground">
          {t.sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
              {section.text.split('\n\n').map((paragraph, pIndex) => (
                <p key={pIndex}>{paragraph}</p>
              ))}
              {section.list && (
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    {section.list.map((item, liIndex) => (
                      <li key={liIndex}>{item}</li>
                    ))}
                  </ul>
                  {section.afterList && <p>{section.afterList}</p>}
                </>
              )}
            </section>
          ))}
        </div>
        
        {/* Actions */}
        <div className="pt-6 border-t border-warm-200 dark:border-warm-700 mt-8">
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              onClick={handleDecline}
              className="px-6 py-3 border border-warm-200 dark:border-warm-700 text-base font-medium rounded-lg bg-white dark:bg-warm-800 hover:bg-warm-100 dark:hover:bg-warm-700 text-foreground transition-colors"
            >
              {t.decline}
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
              {t.accept}
            </button>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}
