import { Routes } from '@angular/router';
import { CleaningLanding } from './features/cleaning/cleaning-landing';
import { EntityDetail } from './features/entities/entity-detail';
import { Home } from './features/home/home';
import { NotFound } from './features/not-found/not-found';
import { RentalLanding } from './features/rental/rental-landing';
import { InfoPage } from './features/static/info-page';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'kutahya/temizlikci', component: CleaningLanding },
  { path: 'kutahya/temizlik', redirectTo: 'kutahya/temizlikci', pathMatch: 'full' },
  { path: 'kutahya/temizlik-sirketi', redirectTo: 'kutahya/temizlikci', pathMatch: 'full' },
  { path: 'temizlik-firmasi/:slug', component: EntityDetail, data: { kind: 'cleaning-company' } },
  { path: 'temizlikci/:slug', component: EntityDetail, data: { kind: 'cleaning-staff' } },
  { path: 'kutahya/arac-kiralama', component: RentalLanding },
  { path: 'kutahya/araba-kiralama', redirectTo: 'kutahya/arac-kiralama', pathMatch: 'full' },
  { path: 'kutahya/oto-kiralama', redirectTo: 'kutahya/arac-kiralama', pathMatch: 'full' },
  { path: 'arac-kiralama-firmasi/:slug', component: EntityDetail, data: { kind: 'rental-company' } },
  { path: 'kiralik-arac/:slug', component: EntityDetail, data: { kind: 'vehicle' } },
  { path: 'hakkimizda', component: InfoPage, data: { key: 'about', title: 'Hakkımızda' } },
  { path: 'iletisim', component: InfoPage, data: { key: 'contact', title: 'İletişim' } },
  { path: 'gizlilik', component: InfoPage, data: { key: 'privacy', title: 'Gizlilik' } },
  { path: 'kullanim-kosullari', component: InfoPage, data: { key: 'terms', title: 'Kullanım Koşulları' } },
  { path: '**', component: NotFound },
];
