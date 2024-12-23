export interface Movie {
  title: string;
  description: string;
  year: number;
  rating: number;
  posterUrl: string;
  genres: string[];
  director: string;
  cast: string[];
  duration: number;
  trailerUrl?: string;
}

export const movies: Movie[] = [
  {
    title: "Миссия: Красный",
    description: "Санта-Клаус под кодовым именем Красный похищен. Начальник службы безопасности Северного полюса должен объединиться с самым известным в мире охотником за головами. Вместе они начинают кругосветную миссию по спасению Рождества.",
    year: 2023,
    rating: 7.0,
    posterUrl: "/movies/red-one.jpg",
    genres: ["боевик", "фэнтези", "комедия"],
    director: "Джейк Каздан",
    cast: ["Дуэйн Джонсон", "Крис Эванс", "Кирнан Шипка"],
    duration: 118,
    trailerUrl: "https://www.youtube.com/watch?v=example1"
  },
  {
    title: "Веном 2",
    description: "Более чем через год после событий первого фильма журналист Эдди Брок пытается приспособиться к жизни в качестве хозяина инопланетного симбиота Венома.",
    year: 2021,
    rating: 6.3,
    posterUrl: "/movies/venom.jpg",
    genres: ["боевик", "фантастика", "триллер"],
    director: "Энди Серкис",
    cast: ["Том Харди", "Мишель Уильямс", "Вуди Харрельсон"],
    duration: 97,
    trailerUrl: "https://www.youtube.com/watch?v=example2"
  },
  {
    title: "Мауи",
    description: "Юная Моана, дочь вождя маленького племени на острове в Тихом океане, больше всего на свете мечтает о приключениях и решает отправиться в опасное морское путешествие.",
    year: 2023,
    rating: 7.0,
    posterUrl: "/movies/maui.jpg",
    genres: ["мультфильм", "приключения", "семейный"],
    director: "Рон Клементс",
    cast: ["Аулии Кравальо", "Дуэйн Джонсон"],
    duration: 107,
    trailerUrl: "https://www.youtube.com/watch?v=example3"
  },
  {
    title: "Мулафа",
    description: "История об отважном львенке по имени Симба, покорившая сердца миллионов людей по всему миру, возвращается на большие экраны в новом зрелищном художественном фильме Disney.",
    year: 2023,
    rating: 6.7,
    posterUrl: "/movies/mulafa.jpg",
    genres: ["приключения", "драма", "семейный"],
    director: "Джон Фавро",
    cast: ["Дональд Гловер", "Бейонсе Ноулз-Картер", "Джеймс Эрл Джонс"],
    duration: 118,
    trailerUrl: "https://www.youtube.com/watch?v=example4"
  },
  {
    title: "Хищные земли",
    description: "В суровых условиях Аляски группа людей сталкивается с опасными хищниками и борется за выживание в дикой природе.",
    year: 2023,
    rating: 6.4,
    posterUrl: "/movies/predator-lands.jpg",
    genres: ["триллер", "приключения", "драма"],
    director: "Джон Дэвис",
    cast: ["Лиам Нисон", "Фрэнк Грилло", "Дермот Малруни"],
    duration: 108,
    trailerUrl: "https://www.youtube.com/watch?v=example5"
  }
];
