import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const origin = process.env['SITE_ORIGIN'];
if (!origin || !/^https:\/\//.test(origin) || origin.endsWith('.example')) throw new Error('Set SITE_ORIGIN to the verified HTTPS production origin.');
const data = JSON.parse(await readFile(resolve(root, 'src/app/data/marketplace.data.json'), 'utf8'));
const eligible = (item) => item.published && item.indexable && !item.isDemo;
const today = new Date().toISOString().slice(0, 10);
const records = [
  { path: '/', lastmod: today },
  { path: '/hakkimizda', lastmod: today },
  { path: '/iletisim', lastmod: today },
  { path: '/gizlilik', lastmod: today },
  { path: '/kullanim-kosullari', lastmod: today },
  ...data.cleaningCompanies.filter(eligible).map((item) => ({ path: `/temizlik-firmasi/${item.slug}`, lastmod: item.updatedAt })),
  ...data.cleaningStaff.filter(eligible).map((item) => ({ path: `/temizlikci/${item.slug}`, lastmod: item.updatedAt })),
  ...data.rentalCompanies.filter(eligible).map((item) => ({ path: `/arac-kiralama-firmasi/${item.slug}`, lastmod: item.updatedAt })),
  ...data.rentalVehicles.filter(eligible).map((item) => ({ path: `/kiralik-arac/${item.slug}`, lastmod: item.updatedAt })),
];
if (data.cleaningCompanies.some(eligible) || data.cleaningStaff.some(eligible)) records.push({ path: '/kutahya/temizlikci', lastmod: today });
if (data.rentalCompanies.some(eligible)) records.push({ path: '/kutahya/arac-kiralama', lastmod: today });
const uniqueRecords = [...new Map(records.map((record) => [record.path, record])).values()];
const urls = uniqueRecords.map(({ path, lastmod }) => `  <url><loc>${new URL(path, origin).toString()}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
await writeFile(resolve(root, 'public/sitemap.xml'), xml, 'utf8');
console.log(`Generated sitemap with ${uniqueRecords.length} canonical URLs.`);
