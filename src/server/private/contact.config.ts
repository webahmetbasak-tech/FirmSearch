export interface PrivateContact { readonly whatsapp: string; readonly displayName: string; }
/** Server-only E.164 destinations. Demo entities intentionally have no destination. */
export const CLEANING_STAFF_CONTACTS: Readonly<Record<string, PrivateContact>> = {
  'ayse-yilmaz': { whatsapp: '905348303443', displayName: 'Ayşe Yılmaz' },
  'fatma-duran': { whatsapp: '905348303443', displayName: 'Fatma Duran' },
};
export const CLEANING_COMPANY_CONTACTS: Readonly<Record<string, PrivateContact>> = {};
export const RENTAL_COMPANY_CONTACTS: Readonly<Record<string, PrivateContact>> = {
  'ahmet-basak': { whatsapp: '905348303443', displayName: 'Ahmet BAŞAK' },
};
export const RENTAL_VEHICLE_CONTACTS: Readonly<Record<string, PrivateContact>> = {};
