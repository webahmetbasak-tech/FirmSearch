import {
  CLEANING_COMPANY_CONTACTS,
  CLEANING_STAFF_CONTACTS,
  PrivateContact,
  RENTAL_COMPANY_CONTACTS,
  RENTAL_VEHICLE_CONTACTS,
} from '../src/server/private/contact.config';
import type { IncomingMessage, ServerResponse } from 'node:http';

type ContactKind = 'cleaning-company' | 'cleaning-staff' | 'rental-company' | 'rental-vehicle';

const contacts: Readonly<Record<ContactKind, Readonly<Record<string, PrivateContact>>>> = {
  'cleaning-company': CLEANING_COMPANY_CONTACTS,
  'cleaning-staff': CLEANING_STAFF_CONTACTS,
  'rental-company': RENTAL_COMPANY_CONTACTS,
  'rental-vehicle': RENTAL_VEHICLE_CONTACTS,
};

const messages: Readonly<Record<ContactKind, (name: string) => string>> = {
  'cleaning-company': (name) => `Merhaba,\n\nKütahya Yerel üzerinden ${name} hizmetleri hakkında bilgi almak istiyorum.`,
  'cleaning-staff': (name) => `Merhaba,\n\nKütahya Yerel üzerinden ${name} profili hakkında bilgi almak ve randevu oluşturmak istiyorum.`,
  'rental-company': (name) => `Merhaba,\n\nKütahya Yerel üzerinden ${name} hakkında bilgi almak istiyorum.`,
  'rental-vehicle': (name) => `Merhaba,\n\nKütahya Yerel üzerinden ${name} hakkında bilgi ve rezervasyon talebi oluşturmak istiyorum.`,
};

export default function handler(request: IncomingMessage, response: ServerResponse): void {
  const url = new URL(request.url ?? '/', `https://${request.headers.host ?? 'kutahyatemizlik.vercel.app'}`);
  const kind = url.searchParams.get('kind') as ContactKind | null;
  const slug = url.searchParams.get('slug');
  const contact = kind && slug && contacts[kind]?.[slug];

  response.setHeader('Cache-Control', 'no-store');
  if (!kind || !slug || !contact || !/^90\d{10}$/.test(contact.whatsapp)) {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.end('İletişim kaydı bulunamadı.');
    return;
  }

  const destination = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(messages[kind](contact.displayName))}`;
  response.statusCode = 302;
  response.setHeader('Location', destination);
  response.end();
}
