import { RenderMode, ServerRoute } from '@angular/ssr';
import marketplaceData from './data/marketplace.data.json';

type Publishable = { readonly slug: string; readonly published: boolean; readonly indexable: boolean; readonly isDemo: boolean };
const prerenderParams = (items: readonly Publishable[]) => async () =>
  items.filter((item) => item.published && item.indexable && !item.isDemo).map((item) => ({ slug: item.slug }));

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'kutahya/temizlikci', renderMode: RenderMode.Prerender },
  { path: 'kutahya/arac-kiralama', renderMode: RenderMode.Prerender },
  { path: 'temizlik-firmasi/:slug', renderMode: RenderMode.Prerender, getPrerenderParams: prerenderParams(marketplaceData.cleaningCompanies) },
  { path: 'temizlikci/:slug', renderMode: RenderMode.Prerender, getPrerenderParams: prerenderParams(marketplaceData.cleaningStaff) },
  { path: 'arac-kiralama-firmasi/:slug', renderMode: RenderMode.Prerender, getPrerenderParams: prerenderParams(marketplaceData.rentalCompanies) },
  { path: 'kiralik-arac/:slug', renderMode: RenderMode.Prerender, getPrerenderParams: prerenderParams(marketplaceData.rentalVehicles) },
  { path: 'hakkimizda', renderMode: RenderMode.Prerender },
  { path: 'iletisim', renderMode: RenderMode.Prerender },
  { path: 'gizlilik', renderMode: RenderMode.Prerender },
  { path: 'kullanim-kosullari', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Server },
];
