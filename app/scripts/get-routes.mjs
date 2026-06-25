import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const toolsDir = join(__dirname, '..', 'src', 'tools');

// استخراج مسیر (path) همه‌ی ابزارها از فایل‌های index.ts
export function getToolPaths() {
  const entries = readdirSync(toolsDir, { withFileTypes: true });
  const paths = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    let content;
    try {
      content = readFileSync(join(toolsDir, entry.name, 'index.ts'), 'utf8');
    }
    catch {
      continue;
    }
    const match = content.match(/path:\s*['"]([^'"]+)['"]/);
    if (match) {
      paths.push(match[1]);
    }
  }

  return paths;
}

// لیست کامل مسیرهای قابل ایندکس (صفحه اصلی + درباره + همه‌ی ابزارها)
export function getAllRoutes() {
  return ['/', '/about', ...getToolPaths().sort()];
}
