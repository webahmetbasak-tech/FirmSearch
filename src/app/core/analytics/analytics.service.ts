import { Injectable } from '@angular/core';
export type AnalyticsEvent = 'cleaning_profile_view' | 'cleaning_whatsapp_click' | 'rental_vehicle_view' | 'rental_whatsapp_click' | 'cleaning_filter' | 'rental_filter';
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  track(_event: AnalyticsEvent, _properties: Readonly<Record<string, string>> = {}): void { /* No-op provider; replace through DI when consent-aware analytics is configured. */ }
}
