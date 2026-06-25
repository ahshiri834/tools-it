import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { getAllRoutes } from './get-routes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');
const PORT = 4188;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

// سرور استاتیک ساده با fallback به index.html برای مسیرهای SPA
// نکته مهم: index.html اصلی را یک‌بار در حافظه نگه می‌داریم تا با نوشتن صفحات
// prerender شده (که داخل dist ذخیره می‌شوند) آلوده نشود.
async function startServer() {
  const templateHtml = await readFile(join(dist, 'index.html'), 'utf8');

  const server = http.createServer(async (req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const filePath = join(dist, urlPath);

    // فایل واقعی با پسوند (assets) → از دیسک سرو شود
    if (urlPath !== '/' && extname(filePath) && existsSync(filePath)) {
      try {
        const data = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': mime[extname(filePath)] || 'application/octet-stream' });
        res.end(data);
        return;
      }
      catch {
        res.writeHead(404);
        res.end('not found');
        return;
      }
    }

    // هر مسیر SPA → همیشه قالب اصلی (نه نسخه prerender شده)
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(templateHtml);
  });

  return new Promise(resolve => server.listen(PORT, () => resolve(server)));
}

async function run() {
  const routes = getAllRoutes();
  const server = await startServer();
  console.log(`▶ static server on http://localhost:${PORT} — prerendering ${routes.length} routes`);

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const page = await context.newPage();

  let ok = 0;
  let failed = 0;

  for (const route of routes) {
    try {
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForSelector('#app > *', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(250);

      const html = await page.content();
      const outDir = route === '/' ? dist : join(dist, route);
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, 'index.html'), html, 'utf8');
      ok++;
      console.log(`  ✓ ${route}`);
    }
    catch (err) {
      failed++;
      console.log(`  ✗ ${route} — ${err.message}`);
    }
  }

  await browser.close();
  server.close();
  console.log(`\n✔ prerender done: ${ok} ok, ${failed} failed`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
