import { ChangeDetectionStrategy, Component, inject, RESPONSE_INIT } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { CleaningCompany, CleaningStaff, RentalCompany, RentalVehicle } from '../../core/models/entities';
import { MarketplaceRepository } from '../../core/repositories/marketplace.repository';
import { SeoService } from '../../core/seo/seo.service';
import { StructuredDataService } from '../../core/seo/structured-data.service';
import { BreadcrumbItem, Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';

type EntityKind = 'cleaning-company' | 'cleaning-staff' | 'rental-company' | 'vehicle';

@Component({
  selector: 'app-entity-detail', imports: [RouterLink, Breadcrumbs], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-shell">
      @if (notFound) {
        <section class="not-found"><p class="eyebrow">404</p><h1>Bu kayıt bulunamadı</h1><p>Bağlantı hatalı, kaldırılmış veya henüz yayınlanmamış olabilir.</p><a class="button primary" routerLink="/">Ana sayfaya dön</a></section>
      } @else {
        <app-breadcrumbs [items]="breadcrumbs" />
        @if (isDemo) {<aside class="demo-banner"><strong>Demo profil</strong><span>Bu kayıt gerçek kişi, işletme veya araç değildir. Arama motorlarına kapalıdır.</span></aside>}
        @switch (kind) {
          @case ('cleaning-company') {
            @if (cleaningCompany; as company) {
              <article class="profile-layout"><section><p class="eyebrow">TEMİZLİK FİRMASI</p><h1>{{ company.name }}</h1><p class="lead">{{ company.description }}</p><div class="fact-grid"><div><span>Doğrulama</span><strong>{{ verificationLabel(company.verification.status) }}</strong></div><div><span>Hizmet bölgesi</span><strong>{{ areaNames(company.serviceAreaIds) }}</strong></div><div><span>Değerlendirme</span><strong>Henüz değerlendirme yok</strong></div><div><span>Son güncelleme</span><strong>{{ company.updatedAt }}</strong></div></div></section><aside class="contact-card"><p class="eyebrow">İLETİŞİM</p><h2>Hizmet kapsamını netleştirin</h2><p>İletişim yalnızca gerçek ve yetkilendirilmiş bir numara eklendiğinde açılır.</p>@if (company.whatsappEnabled && !company.isDemo) {<a class="button whatsapp" [href]="'/randevu/temizlik-firmasi/' + company.slug">WhatsApp ile bilgi al</a>} @else {<span class="button disabled">İletişim henüz açık değil</span>}</aside></article>
              <section class="section"><h2>Uzmanlar</h2>@if (companyStaff.length) {<div class="mini-grid">@for (person of companyStaff; track person.id) {<a class="mini-card linked" [routerLink]="['/temizlikci', person.slug]"><h3>{{ person.name }}</h3><p>{{ person.expertise }}</p><span>Profili incele →</span></a>}</div>} @else {<p>Bu firmaya bağlı yayınlanmış uzman bulunmuyor.</p>}</section>
            }
          }
          @case ('cleaning-staff') {
            @if (staff; as person) {
              <article class="profile-layout"><section><p class="eyebrow">TEMİZLİK UZMANI</p><h1>{{ person.name }}</h1><p class="lead">{{ person.expertise }}</p><p>{{ person.biography }}</p><div class="fact-grid"><div><span>Doğrulama</span><strong>{{ verificationLabel(person.verification.status) }}</strong></div><div><span>Hizmet bölgesi</span><strong>{{ areaNames(person.serviceAreaIds) }}</strong></div><div><span>Değerlendirme</span><strong>Henüz değerlendirme yok</strong></div><div><span>Deneyim</span><strong>{{ person.experienceYears ? person.experienceYears + ' yıl' : 'Bilgi verilmedi' }}</strong></div></div>@if (parentCleaningCompany; as company) {<p class="relation">Bağlı firma: <a [routerLink]="['/temizlik-firmasi', company.slug]">{{ company.name }}</a></p>}</section><aside class="contact-card"><p class="eyebrow">RANDEVU</p><h2>Hizmet hakkında bilgi alın</h2><p>Talep, seçtiğiniz profile ait yetkili iletişim kanalına yönlendirilir.</p>@if (person.whatsappEnabled && !person.isDemo) {<a class="button whatsapp" [href]="'/randevu/temizlikci/' + person.slug">WhatsApp ile bilgi al</a>} @else {<span class="button disabled">İletişim henüz açık değil</span>}</aside></article>
            }
          }
          @case ('rental-company') {
            @if (rentalCompany; as company) {
              <article class="profile-layout"><section><p class="eyebrow">ARAÇ KİRALAMA FİRMASI</p><h1>{{ company.name }}</h1><p class="lead">{{ company.description }}</p><div class="fact-grid"><div><span>Doğrulama</span><strong>{{ verificationLabel(company.verification.status) }}</strong></div><div><span>Hizmet bölgesi</span><strong>{{ areaNames(company.serviceAreaIds) }}</strong></div><div><span>Havalimanı teslimi</span><strong>{{ company.airportDelivery ? 'Sağlanıyor' : 'Sağlandığı doğrulanmadı' }}</strong></div><div><span>Kurumsal kiralama</span><strong>{{ company.corporateRental ? 'Sağlanıyor' : 'Sağlandığı doğrulanmadı' }}</strong></div></div></section><aside class="contact-card rental-contact"><p class="eyebrow">REZERVASYON</p><h2>Kiralama koşullarını sorun</h2><p>Fiyat, müsaitlik, depozito ve teslim koşullarını firmadan yazılı olarak doğrulayın.</p>@if (company.whatsappEnabled && !company.isDemo) {<a class="button whatsapp" [href]="'/rezervasyon/firma/' + company.slug">WhatsApp ile bilgi al</a>} @else {<span class="button disabled">İletişim henüz açık değil</span>}</aside></article>
              <section class="section"><h2>Filo</h2>@if (companyVehicles.length) {<div class="mini-grid">@for (item of companyVehicles; track item.id) {<a class="mini-card linked" [routerLink]="['/kiralik-arac', item.slug]"><h3>{{ item.make }} {{ item.model }}</h3><p>{{ item.category }} · {{ item.transmission === 'AUTOMATIC' ? 'Otomatik' : 'Manuel' }}</p><span>Aracı incele →</span></a>}</div>} @else {<p>Bu firmaya bağlı yayınlanmış araç bulunmuyor.</p>}</section>
            }
          }
          @case ('vehicle') {
            @if (vehicle; as item) {
              <article class="vehicle-detail"><section class="vehicle-visual" aria-label="Araç görseli bulunmuyor"><span>{{ item.make }}</span><strong>{{ item.model }}</strong></section><section><p class="eyebrow">KİRALIK ARAÇ</p><h1>{{ item.make }} {{ item.model }}</h1><p class="availability">Müsaitlik için iletişime geçin.</p><div class="spec-grid"><div><span>Segment</span><strong>{{ item.category }}</strong></div><div><span>Vites</span><strong>{{ item.transmission === 'AUTOMATIC' ? 'Otomatik' : 'Manuel' }}</strong></div><div><span>Yakıt</span><strong>{{ item.fuelType || 'Bilgi verilmedi' }}</strong></div><div><span>Koltuk</span><strong>{{ item.seats || 'Bilgi verilmedi' }}</strong></div></div><div class="price-panel"><span>Fiyat</span><strong>{{ item.pricing?.daily ? item.pricing?.daily + ' TL / gün' : 'Fiyat için iletişime geçin' }}</strong></div>@if (parentRentalCompany; as company) {<p class="relation">Firma: <a [routerLink]="['/arac-kiralama-firmasi', company.slug]">{{ company.name }}</a></p>}@if (item.isDemo || !parentRentalCompany?.whatsappEnabled) {<span class="button disabled">Rezervasyon henüz açık değil</span>} @else {<a class="button whatsapp" [href]="'/rezervasyon/arac/' + item.slug">WhatsApp rezervasyon talebi</a>}</section></article>
            }
          }
        }
      }
    </div>
  `,
})
export class EntityDetail {
  private readonly repository = inject(MarketplaceRepository);
  private readonly seo = inject(SeoService);
  private readonly schema = inject(StructuredDataService);
  private readonly analytics = inject(AnalyticsService);
  private readonly route = inject(ActivatedRoute);
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });
  readonly kind = this.route.snapshot.data['kind'] as EntityKind;
  readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';
  cleaningCompany?: CleaningCompany;
  staff?: CleaningStaff;
  rentalCompany?: RentalCompany;
  vehicle?: RentalVehicle;
  parentCleaningCompany?: CleaningCompany;
  parentRentalCompany?: RentalCompany;
  companyStaff: readonly CleaningStaff[] = [];
  companyVehicles: readonly RentalVehicle[] = [];
  breadcrumbs: readonly BreadcrumbItem[] = [];
  notFound = false;
  isDemo = false;

  constructor() {
    if (this.kind === 'cleaning-company') this.loadCleaningCompany();
    else if (this.kind === 'cleaning-staff') this.loadStaff();
    else if (this.kind === 'rental-company') this.loadRentalCompany();
    else this.loadVehicle();
  }

  areaNames(ids: readonly string[]): string { return ids.map((id) => this.repository.data.areas.find((area) => area.id === id)?.name).filter(Boolean).join(', ') || 'Bilgi verilmedi'; }
  verificationLabel(status: string): string { return status === 'VERIFIED' ? 'Doğrulanmış' : status === 'PENDING' ? 'Doğrulama bekliyor' : 'Doğrulanmamış'; }

  private loadCleaningCompany(): void {
    const item = this.repository.cleaningCompany(this.slug); if (!item) return this.missing();
    this.cleaningCompany = item; this.isDemo = item.isDemo; this.companyStaff = this.repository.cleaningStaff(true).filter((person) => person.companyId === item.id);
    this.breadcrumbs = [{label:'Ana Sayfa',path:'/'},{label:'Temizlikçi',path:'/kutahya/temizlikci'},{label:item.name}];
    this.applyEntitySeo(item.name, item.description, `/temizlik-firmasi/${item.slug}`, item.indexable && !item.isDemo, this.schema.cleaningCompany(item));
  }
  private loadStaff(): void {
    const item = this.repository.staffMember(this.slug); if (!item) return this.missing();
    this.staff = item; this.isDemo = item.isDemo; this.parentCleaningCompany = this.repository.data.cleaningCompanies.find((company) => company.id === item.companyId && company.published);
    this.breadcrumbs = [{label:'Ana Sayfa',path:'/'},{label:'Temizlikçi',path:'/kutahya/temizlikci'},...(this.parentCleaningCompany ? [{label:this.parentCleaningCompany.name,path:`/temizlik-firmasi/${this.parentCleaningCompany.slug}`}] : []),{label:item.name}];
    this.applyEntitySeo(item.name, item.biography, `/temizlikci/${item.slug}`, item.indexable && !item.isDemo, this.schema.staff(item, this.parentCleaningCompany)); this.analytics.track('cleaning_profile_view',{slug:item.slug});
  }
  private loadRentalCompany(): void {
    const item = this.repository.rentalCompany(this.slug); if (!item) return this.missing();
    this.rentalCompany = item; this.isDemo = item.isDemo; this.companyVehicles = this.repository.rentalVehicles(true).filter((vehicle) => vehicle.companyId === item.id);
    this.breadcrumbs = [{label:'Ana Sayfa',path:'/'},{label:'Araç Kiralama',path:'/kutahya/arac-kiralama'},{label:item.name}];
    this.applyEntitySeo(item.name, item.description, `/arac-kiralama-firmasi/${item.slug}`, item.indexable && !item.isDemo, this.schema.rentalCompany(item));
  }
  private loadVehicle(): void {
    const item = this.repository.vehicle(this.slug); if (!item) return this.missing();
    this.vehicle = item; this.isDemo = item.isDemo; this.parentRentalCompany = this.repository.data.rentalCompanies.find((company) => company.id === item.companyId);
    this.breadcrumbs = [{label:'Ana Sayfa',path:'/'},{label:'Araç Kiralama',path:'/kutahya/arac-kiralama'},...(this.parentRentalCompany ? [{label:this.parentRentalCompany.name,path:`/arac-kiralama-firmasi/${this.parentRentalCompany.slug}`}] : []),{label:`${item.make} ${item.model}`}];
    this.applyEntitySeo(`${item.make} ${item.model}`, `Kütahya'da ${item.make} ${item.model} kiralama özellikleri, firma ve rezervasyon bilgileri.`, `/kiralik-arac/${item.slug}`, item.indexable && !item.isDemo, this.schema.vehicle(item, this.parentRentalCompany)); this.analytics.track('rental_vehicle_view',{slug:item.slug});
  }
  private applyEntitySeo(name: string, description: string, path: string, indexable: boolean, entitySchema?: Record<string, unknown>): void {
    const jsonLd = [this.schema.breadcrumbs(this.breadcrumbs.map((item) => ({name:item.label,path:item.path ?? path}))), ...(entitySchema ? [entitySchema] : [])];
    this.seo.apply({ title: `${name} | Kütahya Yerel`, description, path, robots: indexable ? 'index,follow' : 'noindex,follow', jsonLd });
  }
  private missing(): void {
    this.notFound = true; if (this.responseInit) this.responseInit.status = 404;
    this.seo.apply({ title: 'Kayıt Bulunamadı | Kütahya Yerel', description: 'Aradığınız kayıt bulunamadı.', path: this.route.snapshot.url.map((segment) => segment.path).join('/'), robots: 'noindex,nofollow' });
  }
}
