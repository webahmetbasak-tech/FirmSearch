const contactData = require('../src/server/private/contact.data.json');

const contacts = {
  'cleaning-company': contactData.cleaningCompanies,
  'cleaning-staff': contactData.cleaningStaff,
  'rental-company': contactData.rentalCompanies,
  'rental-vehicle': contactData.rentalVehicles,
};

const messages = {
  'cleaning-company': (name) => `Merhaba,\n\nKütahya Yerel üzerinden ${name} hizmetleri hakkında bilgi almak istiyorum.`,
  'cleaning-staff': (name) => `Merhaba,\n\nKütahya Yerel üzerinden ${name} profili hakkında bilgi almak ve randevu oluşturmak istiyorum.`,
  'rental-company': (name) => `Merhaba,\n\nKütahya Yerel üzerinden ${name} hakkında bilgi almak istiyorum.`,
  'rental-vehicle': (name) => `Merhaba,\n\nKütahya Yerel üzerinden ${name} hakkında bilgi ve rezervasyon talebi oluşturmak istiyorum.`,
};

module.exports = function handler(request, response) {
  const url = new URL(request.url || '/', `https://${request.headers.host || 'kutahyatemizlik.vercel.app'}`);
  const kind = url.searchParams.get('kind');
  const slug = url.searchParams.get('slug');
  const contact = kind && slug && contacts[kind] && contacts[kind][slug];

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
};
