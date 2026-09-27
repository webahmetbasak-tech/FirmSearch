import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarketplaceRepository } from '../../core/repositories/marketplace.repository';
import { SeoService } from '../../core/seo/seo.service';
import { StructuredDataService } from '../../core/seo/structured-data.service';
import { Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-rental-landing', imports: [RouterLink, Breadcrumbs], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-shell"><app-breadcrumbs [items]="[{label:'Ana Sayfa',path:'/'},{label:'Kütahya Araç Kiralama'}]" /></div>
    <section class="vertical-hero rental-hero"><div class="page-shell"><p class="eyebrow">KÜTAHYA ARAÇ KİRALAMA</p><h1>Kütahya'da araç kiralama seçeneklerini keşfedin</h1><p class="lead">Firma ve araçları vites, yakıt, kapasite, koşullar ve mevcutsa güncel fiyat bilgisiyle değerlendirin.</p><a class="button primary" routerLink="/kutahya/arac-kiralama" fragment="arac-kiralama-saglayicilari">Araç kiralama profilini görüntüle ↓</a></div></section>
    <section class="page-shell section">
      <div class="section-heading"><div><p class="eyebrow">ARAÇLAR</p><h2>İhtiyacınıza göre filtreleyin</h2></div><p>Filtreli URL'ler varsayılan olarak indekslenmez; ana liste tek kanonik sayfadır.</p></div>
      <div class="filter-bar" aria-label="Araç filtreleri"><span>Segment</span><span>Vites</span><span>Yakıt</span><span>Koltuk</span><span>Firma</span><span>Günlük fiyat</span></div>
      @if (companies.length === 0 && vehicles.length === 0) {<div class="empty-state"><h3>Doğrulanmış gerçek filo henüz eklenmedi</h3><p>Güncel olmayan fiyat veya sahte müsaitlik göstermek yerine sağlayıcı verisini bekliyoruz.</p></div>}
      <section id="arac-kiralama-saglayicilari" class="visible-preview profile-section" aria-labelledby="rental-providers-title">
        <div class="preview-heading"><div><p class="eyebrow">ARAÇ KİRALAMA PROFİLİ</p><h3 id="rental-providers-title">Kütahya'da araç kiralama hizmeti</h3></div><span class="listing-count">{{ companies.length }} sağlayıcı</span></div>
        <div class="profile-card-grid">
          @for (company of companies; track company.id) {
            <a class="profile-card vehicle-card" [routerLink]="['/arac-kiralama-firmasi', company.slug]">
              <span class="profile-avatar rental-avatar" aria-hidden="true">{{ initials(company.name) }}</span>
              <span class="profile-content"><small>ARAÇ KİRALAMA SAĞLAYICISI</small><strong>{{ company.name }}</strong><span>Kütahya Merkez</span><em>Fiyat ve araç bilgisi için iletişime geçin</em><b class="profile-cta">Profili aç</b></span>
              <span class="profile-arrow" aria-hidden="true">→</span>
            </a>
          }
        </div>
      </section>
    </section>
    <section class="answer-block rental-answer"><div class="page-shell"><h2>Araç kiralamadan önce neyi doğrulayın?</h2><div class="answer-grid"><p><strong>Koşullar:</strong> Depozito, yaş ve ehliyet süresi şartlarını yazılı alın.</p><p><strong>Teslimat:</strong> Ofis, adres veya havalimanı tesliminin gerçekten sunulduğunu doğrulayın.</p><p><strong>Fiyat:</strong> Günlük ücretin vergi, kilometre ve ek sürücüyü kapsayıp kapsamadığını sorun.</p></div></div></section>
  `,
})
export class RentalLanding {
  private readonly repository = inject(MarketplaceRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly schema = inject(StructuredDataService);
  readonly companies = this.repository.rentalCompanies();
  readonly vehicles = this.repository.rentalVehicles();
  constructor() {
    const shouldIndex = this.companies.length > 0 && this.route.snapshot.queryParamMap.keys.length === 0;
    const itemUrls = [...this.companies.map((item) => `/arac-kiralama-firmasi/${item.slug}`), ...this.vehicles.map((item) => `/kiralik-arac/${item.slug}`)];
    this.seo.apply({ title: "Kütahya Araç Kiralama ve Kiralık Araçlar | Kütahya Yerel", description: "Kütahya araç kiralama firmalarını ve kiralık araçları güncel özellik, koşul ve varsa fiyat bilgileriyle inceleyin.", path: '/kutahya/arac-kiralama', robots: shouldIndex ? 'index,follow' : 'noindex,follow', jsonLd: [this.schema.collection('Kütahya araç kiralama', '/kutahya/arac-kiralama', itemUrls), this.schema.breadcrumbs([{name:'Ana Sayfa',path:'/'},{name:'Kütahya Araç Kiralama',path:'/kutahya/arac-kiralama'}])] });
  }
  initials(name: string): string { return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toLocaleUpperCase('tr-TR'); }
}
