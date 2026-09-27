import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'kutahya/temizlikci', renderMode: RenderMode.Prerender },
  { path: 'kutahya/arac-kiralama', renderMode: RenderMode.Prerender },
  { path: 'hakkimizda', renderMode: RenderMode.Prerender },
  { path: 'iletisim', renderMode: RenderMode.Prerender },
  { path: 'gizlilik', renderMode: RenderMode.Prerender },
  { path: 'kullanim-kosullari', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Server },
];
