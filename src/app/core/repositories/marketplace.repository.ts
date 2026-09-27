import { Injectable } from '@angular/core';
import data from '../../data/marketplace.data.json';
import { CleaningCompany, CleaningStaff, MarketplaceData, RentalCompany, RentalVehicle, Review } from '../models/entities';
const MARKETPLACE_DATA = data as MarketplaceData;

@Injectable({ providedIn: 'root' })
export class MarketplaceRepository {
  readonly data = MARKETPLACE_DATA;
  cleaningCompanies(includeDemo = false): readonly CleaningCompany[] { return this.data.cleaningCompanies.filter((item) => item.published && (includeDemo || !item.isDemo)); }
  cleaningStaff(includeDemo = false): readonly CleaningStaff[] { return this.data.cleaningStaff.filter((item) => item.published && (includeDemo || !item.isDemo)); }
  rentalCompanies(includeDemo = false): readonly RentalCompany[] { return this.data.rentalCompanies.filter((item) => item.published && (includeDemo || !item.isDemo)); }
  rentalVehicles(includeDemo = false): readonly RentalVehicle[] { return this.data.rentalVehicles.filter((item) => item.published && (includeDemo || !item.isDemo)); }
  cleaningCompany(slug: string): CleaningCompany | undefined { return this.data.cleaningCompanies.find((item) => item.slug === slug && item.published); }
  staffMember(slug: string): CleaningStaff | undefined { return this.data.cleaningStaff.find((item) => item.slug === slug && item.published); }
  rentalCompany(slug: string): RentalCompany | undefined { return this.data.rentalCompanies.find((item) => item.slug === slug && item.published); }
  vehicle(slug: string): RentalVehicle | undefined { return this.data.rentalVehicles.find((item) => item.slug === slug && item.published); }
  reviews(entityId: string): readonly Review[] { return this.data.reviews.filter((review) => review.entityId === entityId && review.status === 'PUBLISHED'); }
}
