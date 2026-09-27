import { Injectable } from '@angular/core';
import { SITE_CONFIG } from '../config/site.config';
import { CleaningCompany, CleaningStaff, RentalCompany, RentalVehicle } from '../models/entities';

interface Crumb { name: string; path: string; }

@Injectable({ providedIn: 'root' })
export class StructuredDataService {
  website(): Record<string, unknown> {
    return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_CONFIG.origin}/#website`, name: SITE_CONFIG.brand.name, url: `${SITE_CONFIG.origin}/`, inLanguage: 'tr-TR' };
  }

  collection(name: string, path: string, itemUrls: readonly string[]): Record<string, unknown> {
    const url = this.absolute(path);
    return {
      '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${url}#page`, name, url, inLanguage: 'tr-TR',
      mainEntity: { '@type': 'ItemList', numberOfItems: itemUrls.length, itemListElement: itemUrls.map((item, index) => ({ '@type': 'ListItem', position: index + 1, url: this.absolute(item) })) },
    };
  }

  breadcrumbs(items: readonly Crumb[]): Record<string, unknown> {
    return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: this.absolute(item.path) })) };
  }

  cleaningCompany(company: CleaningCompany): Record<string, unknown> | undefined {
    if (company.isDemo) return undefined;
    const url = this.absolute(`/temizlik-firmasi/${company.slug}`);
    return { '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': `${url}#business`, name: company.name, description: company.description, url, ...(company.address ? { address: { '@type': 'PostalAddress', ...company.address } } : {}) };
  }

  staff(staff: CleaningStaff, company?: CleaningCompany): Record<string, unknown> | undefined {
    if (staff.isDemo) return undefined;
    const url = this.absolute(`/temizlikci/${staff.slug}`);
    return { '@context': 'https://schema.org', '@type': 'Person', '@id': `${url}#person`, name: staff.name, description: staff.biography, url, ...(company && !company.isDemo ? { worksFor: { '@id': `${this.absolute(`/temizlik-firmasi/${company.slug}`)}#business` } } : {}) };
  }

  rentalCompany(company: RentalCompany): Record<string, unknown> | undefined {
    if (company.isDemo) return undefined;
    const url = this.absolute(`/arac-kiralama-firmasi/${company.slug}`);
    return { '@context': 'https://schema.org', '@type': 'AutoRental', '@id': `${url}#business`, name: company.name, description: company.description, url, ...(company.address ? { address: { '@type': 'PostalAddress', ...company.address } } : {}) };
  }

  vehicle(vehicle: RentalVehicle, company?: RentalCompany): Record<string, unknown> | undefined {
    if (vehicle.isDemo) return undefined;
    const url = this.absolute(`/kiralik-arac/${vehicle.slug}`);
    const daily = vehicle.pricing?.daily;
    return {
      '@context': 'https://schema.org', '@type': 'Car', '@id': `${url}#vehicle`, name: `${vehicle.make} ${vehicle.model}`, url,
      vehicleConfiguration: vehicle.category, vehicleTransmission: vehicle.transmission, fuelType: vehicle.fuelType, seatingCapacity: vehicle.seats,
      ...(company && !company.isDemo ? { provider: { '@id': `${this.absolute(`/arac-kiralama-firmasi/${company.slug}`)}#business` } } : {}),
      ...(daily !== undefined ? { offers: { '@type': 'Offer', price: daily, priceCurrency: vehicle.pricing?.currency, businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut', availability: 'https://schema.org/LimitedAvailability', url } } : {}),
    };
  }

  private absolute(path: string): string { return new URL(path, SITE_CONFIG.origin).toString(); }
}
