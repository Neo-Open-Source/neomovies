/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://neomovies.ru',
  generateRobotsTxt: true, // создает robots.txt
  sitemapSize: 7000,
  // игнорируем служебные пути
  exclude: ['/admin', '/auth'],
};
