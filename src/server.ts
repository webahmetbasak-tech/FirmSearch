import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express, { Response } from 'express';
import { join } from 'node:path';
import { CLEANING_COMPANY_CONTACTS, CLEANING_STAFF_CONTACTS, PrivateContact, RENTAL_COMPANY_CONTACTS, RENTAL_VEHICLE_CONTACTS } from './server/private/contact.config';

const browserDistFolder = join(import.meta.dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine();
app.disable('x-powered-by');
app.use((_req, res, next) => { res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin'); res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(), microphone=()'); res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); next(); });

const permanentRedirects: Readonly<Record<string, string>> = {
  '/kutahya/temizlik': '/kutahya/temizlikci', '/kutahya/temizlik-sirketi': '/kutahya/temizlikci',
  '/kutahya/araba-kiralama': '/kutahya/arac-kiralama', '/kutahya/oto-kiralama': '/kutahya/arac-kiralama',
};
for (const [source, target] of Object.entries(permanentRedirects)) app.get(source, (_req, res) => res.redirect(301, target));

function whatsappRedirect(res: Response, contact: PrivateContact | undefined, message: string): void {
  if (!contact || !/^90\d{10}$/.test(contact.whatsapp)) { res.status(404).send('İletişim kaydı bulunamadı.'); return; }
  res.setHeader('Cache-Control', 'no-store'); res.redirect(302, `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`);
}
app.get('/randevu/temizlikci/:slug', (req, res) => { const contact = CLEANING_STAFF_CONTACTS[req.params['slug']]; whatsappRedirect(res, contact, `Merhaba,\n\nKütahya Yerel üzerinden ${contact?.displayName ?? 'temizlik uzmanı'} profili hakkında bilgi almak ve randevu oluşturmak istiyorum.`); });
app.get('/randevu/temizlik-firmasi/:slug', (req, res) => { const contact = CLEANING_COMPANY_CONTACTS[req.params['slug']]; whatsappRedirect(res, contact, `Merhaba,\n\nKütahya Yerel üzerinden ${contact?.displayName ?? 'temizlik firması'} hizmetleri hakkında bilgi almak istiyorum.`); });
app.get('/rezervasyon/firma/:slug', (req, res) => { const contact = RENTAL_COMPANY_CONTACTS[req.params['slug']]; whatsappRedirect(res, contact, `Merhaba,\n\nKütahya Yerel üzerinden ${contact?.displayName ?? 'araç kiralama firması'} hakkında bilgi almak istiyorum.`); });
app.get('/rezervasyon/arac/:slug', (req, res) => { const contact = RENTAL_VEHICLE_CONTACTS[req.params['slug']]; whatsappRedirect(res, contact, `Merhaba,\n\nKütahya Yerel üzerinden ${contact?.displayName ?? 'kiralık araç'} hakkında bilgi ve rezervasyon talebi oluşturmak istiyorum.`); });

app.use(express.static(browserDistFolder, { maxAge: '1h', index: false, redirect: false }));
app.use((req, res, next) => { angularApp.handle(req).then((response) => response ? writeResponseToNodeResponse(response, res) : next()).catch(next); });
if (isMainModule(import.meta.url) || process.env['pm_id']) { const port = process.env['PORT'] || 4000; app.listen(port, (error) => { if (error) throw error; console.log(`Node Express server listening on http://localhost:${port}`); }); }
export const reqHandler = createNodeRequestHandler(app);
