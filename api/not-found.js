module.exports = function handler(_request, response) {
  const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Sayfa bulunamadı | Kütahya Yerel</title><style>body{font-family:system-ui,sans-serif;margin:0;color:#17231d;background:#f7f8f4}main{max-width:44rem;margin:12vh auto;padding:2rem}a{color:#216443;font-weight:700}</style></head><body><main><p>404</p><h1>Sayfa bulunamadı</h1><p>Aradığınız adres kaldırılmış veya hiç oluşturulmamış olabilir.</p><p><a href="/">Ana sayfaya dön</a></p></main></body></html>`;
  response.statusCode = 404;
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.end(html);
};
