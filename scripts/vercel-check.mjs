import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const contactHandler = require('../api/contact.js');
const notFoundHandler = require('../api/not-found.js');

function responseDouble() {
  const headers = new Map();
  return {
    statusCode: 200,
    body: undefined,
    setHeader(name, value) { headers.set(name.toLowerCase(), value); },
    getHeader(name) { return headers.get(name.toLowerCase()); },
    end(body) { this.body = body; },
  };
}

for (const [kind, slug, name] of [
  ['cleaning-staff', 'ayse-yilmaz', 'Ayşe Yılmaz'],
  ['cleaning-staff', 'fatma-duran', 'Fatma Duran'],
  ['rental-company', 'ahmet-basak', 'Ahmet BAŞAK'],
]) {
  const response = responseDouble();
  contactHandler({ url: `/api/contact?kind=${kind}&slug=${slug}`, headers: { host: 'kutahyatemizlik.vercel.app' } }, response);
  assert.equal(response.statusCode, 302);
  assert.match(response.getHeader('location'), /^https:\/\/wa\.me\/905348303443\?text=/);
  assert.ok(decodeURIComponent(response.getHeader('location')).includes(name));
}

const missingContact = responseDouble();
contactHandler({ url: '/api/contact?kind=cleaning-staff&slug=bilinmeyen', headers: {} }, missingContact);
assert.equal(missingContact.statusCode, 404);

const missingPage = responseDouble();
notFoundHandler({}, missingPage);
assert.equal(missingPage.statusCode, 404);
assert.match(missingPage.body, /noindex,follow/);

console.log('Vercel function validation passed: contacts, safe redirects and 404 response.');
