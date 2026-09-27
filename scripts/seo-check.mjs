import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const port = process.env['SEO_PORT'] ?? '4173';
const externalBase = process.env['SEO_BASE_URL'];
const base = externalBase ?? `http://127.0.0.1:${port}`;
let server;
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

async function waitForServer() { for (let attempt=0; attempt<40; attempt++) { try { const response=await fetch(base); if (response.ok) return; } catch {} await new Promise((resolveWait)=>setTimeout(resolveWait,250)); } throw new Error(`SSR server did not start at ${base}`); }
function jsonLdIsValid(html, path) { const matches=[...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]; assert(matches.length>0, `${path}: missing JSON-LD`); for (const match of matches) { try { const value=JSON.parse(match[1]); assert(Boolean(value['@context']),`${path}: JSON-LD missing @context`); } catch(error) { failures.push(`${path}: invalid JSON-LD (${error.message})`); } } }
async function checkPage(path, expectedStatus=200) { const response=await fetch(`${base}${path}`,{redirect:'manual'}); const html=await response.text(); assert(response.status===expectedStatus,`${path}: expected ${expectedStatus}, got ${response.status}`); if (expectedStatus===200) { assert(/<title>[^<]+<\/title>/.test(html),`${path}: missing title`); assert(/<meta[^>]+name="description"[^>]+content="[^"]+"/.test(html),`${path}: missing description`); assert(/<h1[^>]*>/.test(html),`${path}: missing H1`); assert(/<link[^>]+rel="canonical"[^>]+href="https:\/\//.test(html),`${path}: missing absolute canonical`); assert(/<meta[^>]+name="robots"/.test(html),`${path}: missing robots meta`); assert(/<a[^>]+href=/.test(html),`${path}: missing internal links`); jsonLdIsValid(html,path); } return {response,html}; }

try {
  if (!externalBase) { server=spawn(process.execPath,['dist/firm-search/server/server.mjs'],{cwd:root,env:{...process.env,PORT:port},stdio:['ignore','pipe','pipe']}); server.stderr.on('data',(chunk)=>process.stderr.write(chunk)); await waitForServer(); }
  const publishedPages = new Map();
  for (const path of ['/', '/kutahya/temizlikci', '/temizlikci/ayse-yilmaz', '/temizlikci/fatma-duran', '/kutahya/arac-kiralama', '/arac-kiralama-firmasi/ahmet-basak']) { const {html}=await checkPage(path); publishedPages.set(path, html); assert(!html.includes('noindex'),`${path}: published page must be indexable`); assert(!/demo/i.test(html),`${path}: demo text leaked into published HTML`); }
  const cleaningHtml=publishedPages.get('/kutahya/temizlikci');
  assert(cleaningHtml.includes('href="/kutahya/temizlikci#temizlikci-profilleri"'),'/kutahya/temizlikci: category fragment link is incorrect');
  assert(!cleaningHtml.includes('href="#temizlikci-profilleri"'),'/kutahya/temizlikci: root-resolving fragment link leaked');
  assert(cleaningHtml.includes('href="/temizlikci/ayse-yilmaz"'),'/kutahya/temizlikci: Ayşe profile link missing');
  assert(cleaningHtml.includes('href="/temizlikci/fatma-duran"'),'/kutahya/temizlikci: Fatma profile link missing');
  const rentalHtml=publishedPages.get('/kutahya/arac-kiralama');
  assert(rentalHtml.includes('href="/kutahya/arac-kiralama#arac-kiralama-saglayicilari"'),'/kutahya/arac-kiralama: category fragment link is incorrect');
  assert(rentalHtml.includes('href="/arac-kiralama-firmasi/ahmet-basak"'),'/kutahya/arac-kiralama: Ahmet profile link missing');
  await checkPage('/temizlikci/bilinmeyen-kayit',404); await checkPage('/kiralik-arac/bilinmeyen-kayit',404); await checkPage('/tamamen-bilinmeyen',404);
  for (const [source,target] of [['/kutahya/temizlik','/kutahya/temizlikci'],['/kutahya/araba-kiralama','/kutahya/arac-kiralama'],['/kutahya/oto-kiralama','/kutahya/arac-kiralama']]) { const response=await fetch(`${base}${source}`,{redirect:'manual'}); assert(response.status===301,`${source}: expected 301`); assert(response.headers.get('location')===target,`${source}: wrong redirect target`); }
  const robots=await (await fetch(`${base}/robots.txt`)).text(); for (const bot of ['Googlebot','bingbot','OAI-SearchBot','Claude-SearchBot','PerplexityBot']) assert(robots.includes(bot),`robots.txt: missing ${bot}`); assert(/User-agent: GPTBot\s+Disallow: \//.test(robots),'robots.txt: GPTBot policy missing');
  const sitemap=await (await fetch(`${base}/sitemap.xml`)).text(); assert(sitemap.includes('<urlset'),'sitemap.xml: invalid root'); for (const path of ['/kutahya/temizlikci','/temizlikci/ayse-yilmaz','/temizlikci/fatma-duran','/kutahya/arac-kiralama','/arac-kiralama-firmasi/ahmet-basak']) assert(sitemap.includes(path),`sitemap.xml: missing ${path}`); assert((sitemap.match(/<url>/g) ?? []).length===10,'sitemap.xml: expected 10 canonical URLs');
  for (const [path, label] of [['/randevu/temizlikci/ayse-yilmaz','Ayşe'],['/randevu/temizlikci/fatma-duran','Fatma'],['/rezervasyon/firma/ahmet-basak','Ahmet']]) { const response=await fetch(`${base}${path}`,{redirect:'manual'}); assert(response.status===302,`${label} contact: expected 302`); assert(response.headers.get('location')?.startsWith('https://wa.me/905348303443?text='),`${label} contact: unsafe or incorrect destination`); }
} finally { if (server) server.kill(); }
if (failures.length) { console.error(`SEO validation failed (${failures.length}):\n- ${failures.join('\n- ')}`); process.exit(1); }
console.log('SEO/SSR validation passed: metadata, H1, canonicals, JSON-LD, redirects, 404s, robots and sitemap.');
