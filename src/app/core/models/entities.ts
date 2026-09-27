export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'UNVERIFIED';
export type VerificationType = 'IDENTITY' | 'PHONE' | 'COMPANY' | 'MANUAL';
export interface Verification { status: VerificationStatus; type?: VerificationType; verifiedAt?: string; }
export interface Address { streetAddress?: string; addressLocality: string; addressRegion: string; postalCode?: string; addressCountry: 'TR'; }
export interface BusinessBase { id: string; slug: string; name: string; description: string; verification: Verification; serviceAreaIds: readonly string[]; published: boolean; indexable: boolean; isDemo: boolean; updatedAt: string; address?: Address; }
export interface CleaningService { id: string; name: string; description: string; }
export interface CleaningCompany extends BusinessBase { serviceIds: readonly string[]; staffIds: readonly string[]; whatsappEnabled: boolean; }
export interface CleaningStaff { id: string; slug: string; companyId: string; name: string; expertise: string; biography: string; serviceIds: readonly string[]; serviceAreaIds: readonly string[]; experienceYears?: number; verification: Verification; whatsappEnabled: boolean; published: boolean; indexable: boolean; isDemo: boolean; updatedAt: string; }
export interface RentalPricing { daily?: number; weekly?: number; monthly?: number; currency: 'TRY'; updatedAt?: string; }
export type VehicleCategory = 'ECONOMY' | 'COMPACT' | 'SEDAN' | 'SUV' | 'VAN' | 'PREMIUM' | 'OTHER';
export type VehicleAvailability = 'ON_REQUEST' | 'AVAILABLE' | 'UNAVAILABLE';
export interface RentalVehicle { id: string; slug: string; companyId: string; make: string; model: string; year?: number; category: VehicleCategory; transmission?: 'MANUAL' | 'AUTOMATIC'; fuelType?: string; seats?: number; doors?: number; luggage?: number; pricing?: RentalPricing; availability: VehicleAvailability; availabilityVerifiedAt?: string; published: boolean; indexable: boolean; isDemo: boolean; updatedAt: string; }
export interface RentalCompany extends BusinessBase { vehicleIds: readonly string[]; airportDelivery?: boolean; corporateRental?: boolean; whatsappEnabled: boolean; }
export interface Area { id: string; name: string; }
export interface Review { id: string; entityType: 'CLEANING_STAFF' | 'CLEANING_COMPANY' | 'RENTAL_COMPANY' | 'RENTAL_VEHICLE'; entityId: string; authorName: string; rating: number; comment: string; createdAt: string; verifiedCustomer?: boolean; status: 'PUBLISHED' | 'PENDING' | 'REJECTED'; }
export interface MarketplaceData { areas: readonly Area[]; cleaningServices: readonly CleaningService[]; cleaningCompanies: readonly CleaningCompany[]; cleaningStaff: readonly CleaningStaff[]; rentalCompanies: readonly RentalCompany[]; rentalVehicles: readonly RentalVehicle[]; reviews: readonly Review[]; }
