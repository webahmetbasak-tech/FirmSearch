import contactData from './contact.data.json';

export interface PrivateContact { readonly whatsapp: string; readonly displayName: string; }
/** Server-only E.164 destinations shared by the Node server and Vercel Functions. */
export const CLEANING_STAFF_CONTACTS: Readonly<Record<string, PrivateContact>> = contactData.cleaningStaff;
export const CLEANING_COMPANY_CONTACTS: Readonly<Record<string, PrivateContact>> = contactData.cleaningCompanies;
export const RENTAL_COMPANY_CONTACTS: Readonly<Record<string, PrivateContact>> = contactData.rentalCompanies;
export const RENTAL_VEHICLE_CONTACTS: Readonly<Record<string, PrivateContact>> = contactData.rentalVehicles;
