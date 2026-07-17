import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAllRoutes } from './get-routes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOMAIN = 'https://tools-it.ir';

const routes = getAllRoutes();
const today = new Date().toISOString().split('T')[0];

const urls = routes
  .map((route) => {
    // با اسلش پایانی، هم‌راستا با canonical و با فرمی که آپاچی سرو می‌کند
    const loc = `${DOMAIN}${route.endsWith('/') ? route : `${route}/`}`;
    const priority = route === '/' ? '1.0' : '0.8';
    const changefreq = route === '/' ? 'daily' : 'weekly';
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

const outPath = join(__dirname, '..', 'public', 'sitemap.xml');
writeFileSync(outPath, xml, 'utf8');

console.log(`✓ sitemap.xml generated with ${routes.length} URLs → public/sitemap.xml`);
