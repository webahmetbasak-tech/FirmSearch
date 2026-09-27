import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarketplaceRepository } from '../../core/repositories/marketplace.repository';
import { SeoService } from '../../core/seo/seo.service';
import { StructuredDataService } from '../../core/seo/structured-data.service';
import { Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-cleaning-landing', imports: [RouterLink, Breadcrumbs], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-shell"><app-breadcrumbs [items]="[{label:'Ana Sayfa',path:'/'},{label:'Kütahya Temizlikçi'}]" /></div>
    <section class="vertical-hero cleaning-hero"><div class="page-shell"><p class="eyebrow">KÜTAHYA TEMİZLİK HİZMETLERİ</p><h1>Kütahya'da temizlikçi ve temizlik firması bulun</h1><p class="lead">Firma ve uzman profillerini hizmet kapsamı, bölge ve doğrulanma bilgileriyle inceleyin.</p><a class="button primary" routerLink="/kutahya/temizlikci" fragment="temizlikci-profilleri">Temizlikçi profillerini görüntüle ↓</a></div></section>
    <section class="page-shell section">
      <div class="section-heading"><div><p class="eyebrow">HİZMETLER</p><h2>Aradığınız temizlik türünü netleştirin</h2></div><p>Alt hizmet sayfaları yalnızca gerçek sağlayıcı envanteri yeterli olduğunda yayınlanır.</p></div>
      <div class="mini-grid">@for (service of services; track service.id) {<a class="mini-card linked" routerLink="/kutahya/temizlikci" fragment="temizlikci-profilleri"><h3>{{ service.name }}</h3><p>{{ service.description }}</p><span>Uygun profilleri görüntüle ↓</span></a>}</div>
    </section>
    <section id="temizlikci-profilleri" class="page-shell section profile-section">
      <p class="eyebrow">FİRMALAR VE UZMANLAR</p><h2>Kütahya'da hizmet verenler</h2>
      @if (companies.length === 0 && staff.length === 0) {<div class="empty-state"><h3>Doğrulanmış gerçek ilan henüz eklenmedi</h3><p>Eksik veya uydurma profil göstermek yerine, sağlayıcı verisi doğrulanana kadar bu alanı boş tutuyoruz.</p></div>}
      <section class="visible-preview" aria-labelledby="cleaners-title">
        <div class="preview-heading"><div><p class="eyebrow">TEMİZLİKÇİ PROFİLLERİ</p><h3 id="cleaners-title">Kütahya'da hizmet veren temizlikçiler</h3></div><span class="listing-count">{{ staff.length }} profil</span></div>
        <div class="profile-card-grid">
          @for (person of staff; track person.id) {
            <a class="profile-card" [routerLink]="['/temizlikci', person.slug]">
              <span class="profile-avatar" aria-hidden="true">{{ initials(person.name) }}</span>
              <span class="profile-content"><small>TEMİZLİKÇİ PROFİLİ</small><strong>{{ person.name }}</strong><span>{{ person.expertise }}</span><em>Henüz değerlendirme yok</em><b class="profile-cta">Profili aç</b></span>
              <span class="profile-arrow" aria-hidden="true">→</span>
            </a>
          }
        </div>
      </section>
    </section>
    <section class="answer-block"><div class="page-shell"><h2>Temizlik hizmeti seçerken neyi sorun?</h2><div class="answer-grid"><p><strong>Kapsam:</strong> Cam, fırın, balkon veya malzeme hizmete dahil mi?</p><p><strong>Süre:</strong> Kaç kişi gelecek ve tahmini çalışma süresi nedir?</p><p><strong>Güven:</strong> Profildeki doğrulama türü ve tarihi güncel mi?</p></div></div></section>
  `,
})
export class CleaningLanding {
  private readonly repository = inject(MarketplaceRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly schema = inject(StructuredDataService);
  readonly services = this.repository.data.cleaningServices;
  readonly companies = this.repository.cleaningCompanies();
  readonly staff = this.repository.cleaningStaff();
  constructor() {
    const shouldIndex = (this.companies.length > 0 || this.staff.length > 0) && this.route.snapshot.queryParamMap.keys.length === 0;
    const itemUrls = [...this.companies.map((item) => `/temizlik-firmasi/${item.slug}`), ...this.staff.map((item) => `/temizlikci/${item.slug}`)];
    this.seo.apply({ title: "Kütahya Temizlikçi ve Temizlik Firmaları | Kütahya Yerel", description: "Kütahya'da temizlikçi, ev temizliği ve temizlik firması seçeneklerini hizmet ve doğrulama bilgileriyle inceleyin.", path: '/kutahya/temizlikci', robots: shouldIndex ? 'index,follow' : 'noindex,follow', jsonLd: [this.schema.collection('Kütahya temizlik hizmetleri', '/kutahya/temizlikci', itemUrls), this.schema.breadcrumbs([{name:'Ana Sayfa',path:'/'},{name:'Kütahya Temizlikçi',path:'/kutahya/temizlikci'}])] });
  }
  initials(name: string): string { return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toLocaleUpperCase('tr-TR'); }
}
