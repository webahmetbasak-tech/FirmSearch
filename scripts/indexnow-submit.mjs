const key = process.env['INDEXNOW_KEY'];
const origin = process.env['SITE_ORIGIN'];
const urls = (process.env['INDEXNOW_URLS'] ?? '').split(',').map((item) => item.trim()).filter(Boolean);
if (!key || !origin || urls.length === 0) throw new Error('Set INDEXNOW_KEY, SITE_ORIGIN and comma-separated INDEXNOW_URLS.');
const host = new URL(origin).host;
for (const url of urls) if (new URL(url).host !== host) throw new Error(`Refusing cross-origin URL: ${url}`);
const response = await fetch('https://api.indexnow.org/indexnow', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({host,key,keyLocation:`${origin.replace(/\/$/,'')}/${key}.txt`,urlList:urls}) });
if (!response.ok && response.status !== 202) throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`);
console.log(`IndexNow accepted ${urls.length} changed URL(s) with status ${response.status}.`);
