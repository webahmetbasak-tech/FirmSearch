import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const [siteSource, angularSource, robots, sitemap, dataSource, serverRoutesSource, vercelSource, contactFunctionSource] = await Promise.all([
  readFile(resolve(root, 'src/app/core/config/site.config.ts'), 'utf8'),
  readFile(resolve(root, 'angular.json'), 'utf8'),
  readFile(resolve(root, 'public/robots.txt'), 'utf8'),
  readFile(resolve(root, 'public/sitemap.xml'), 'utf8'),
  readFile(resolve(root, 'src/app/data/marketplace.data.json'), 'utf8'),
  readFile(resolve(root, 'src/app/app.routes.server.ts'), 'utf8'),
  readFile(resolve(root, 'vercel.json'), 'utf8'),
  readFile(resolve(root, 'api/contact.ts'), 'utf8'),
]);
const errors = [];
const origin = siteSource.match(/origin:\s*'([^']+)'/)?.[1];
if (!origin) errors.push('SITE_CONFIG.origin is missing.');
else {
  const url = new URL(origin);
  if (url.protocol !== 'https:') errors.push('Production origin must use HTTPS.');
  if (url.hostname.endsWith('.example')) errors.push('Production domain is still pending.');
  const angular = JSON.parse(angularSource);
  const allowedHosts = angular.projects['firm-search'].architect.build.options.security.allowedHosts;
  if (!allowedHosts.includes(url.hostname)) errors.push(`Angular allowedHosts is missing ${url.hostname}.`);
  if (!robots.includes(`Sitemap: ${origin.replace(/\/$/, '')}/sitemap.xml`)) errors.push('robots.txt sitemap origin does not match SITE_CONFIG.origin.');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (locs.length !== 10) errors.push(`Expected 10 sitemap URLs, found ${locs.length}.`);
  if (locs.some((loc) => !loc.startsWith(origin.replace(/\/$/, '')))) errors.push('Sitemap contains a mismatched origin.');
}
const data = JSON.parse(dataSource);
const published = ['cleaningCompanies','cleaningStaff','rentalCompanies','rentalVehicles'].flatMap((group) => data[group]).filter((item) => item.published);
if (published.some((item) => item.isDemo)) errors.push('Published demo inventory exists.');
if (published.some((item) => !item.indexable)) errors.push('Published inventory contains a noindex entity.');
if (published.some((item) => /demo|örnek/i.test(`${item.name ?? ''} ${item.make ?? ''} ${item.model ?? ''}`))) errors.push('Placeholder inventory text exists.');
for (const route of ['temizlik-firmasi/:slug','temizlikci/:slug','arac-kiralama-firmasi/:slug','kiralik-arac/:slug']) {
  if (!serverRoutesSource.includes(`path: '${route}'`) || !serverRoutesSource.includes('getPrerenderParams')) errors.push(`Missing inventory prerender route: ${route}.`);
}
const vercel = JSON.parse(vercelSource);
const rewrites = vercel.rewrites ?? [];
for (const source of ['/randevu/temizlikci/:slug','/randevu/temizlik-firmasi/:slug','/rezervasyon/firma/:slug','/rezervasyon/arac/:slug']) {
  if (!rewrites.some((rewrite) => rewrite.source === source && rewrite.destination.startsWith('/api/contact'))) errors.push(`Missing Vercel contact rewrite: ${source}.`);
}
if (!rewrites.some((rewrite) => rewrite.source === '/:path*' && rewrite.destination === '/api/not-found')) errors.push('Missing Vercel 404 fallback.');
if (!contactFunctionSource.includes("from '../src/server/private/contact.config'")) errors.push('Vercel contact function is not using the private contact configuration.');
if (errors.length) { console.error(`Release check failed (${errors.length}):\n- ${errors.join('\n- ')}`); process.exit(1); }
console.log(`Release check passed for ${origin}: ${published.length} published/indexable inventory records, 10 sitemap URLs and Vercel routing.`);
