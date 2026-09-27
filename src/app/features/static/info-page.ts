import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { StructuredDataService } from '../../core/seo/structured-data.service';
import { Breadcrumbs } from '../../shared/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-info-page', imports: [Breadcrumbs], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="page-shell prose-page"><app-breadcrumbs [items]="[{label:'Ana Sayfa',path:'/'},{label:title}]" /><p class="eyebrow">KÜTAHYA YEREL</p><h1>{{ title }}</h1>@switch (key) {@case ('about') {<p>Kütahya Yerel, temizlik hizmetleri ile araç kiralama seçeneklerini ayrı bilgi mimarileri içinde sunan yerel keşif platformudur.</p><h2>Yayın ilkelerimiz</h2><p>Gerçek olmayan doğrulama, fiyat, müsaitlik, yorum veya adres yayınlamayız. Yalnızca yayın kriterlerini karşılayan sağlayıcı profilleri indekslenir.</p>} @case ('contact') {<p>Hizmet sağlayıcılarıyla ilgili profil sayfasındaki WhatsApp düğmesi üzerinden doğrudan iletişime geçebilirsiniz.</p><h2>Profil bilgileri</h2><p>Hizmet kapsamı, fiyat, müsaitlik ve koşulları işlem öncesinde ilgili sağlayıcıyla yazılı olarak doğrulayın.</p>} @case ('privacy') {<p>Bu uygulama varsayılan olarak üçüncü taraf analitik çalıştırmaz. WhatsApp yönlendirmeleri sunucuda güvenli bir varlık eşlemesi üzerinden oluşturulur; rastgele hedef numara kabul edilmez.</p><h2>Veri sorumluluğu</h2><p>Profil bilgileri yalnızca hizmet keşfi ve ilgili sağlayıcıyla iletişim kurulması amacıyla sunulur.</p>} @default {<p>Platform yalnızca keşif ve sağlayıcıyla iletişim kolaylığı sunar. Hizmet veya kiralama sözleşmesi kullanıcı ile ilgili sağlayıcı arasında kurulur.</p><h2>Doğruluk ve güncellik</h2><p>Sağlayıcılar fiyat, müsaitlik, kapsam ve koşulları işlem öncesinde yazılı olarak doğrulamalıdır.</p>}}</div>`,
})
export class InfoPage {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly schema = inject(StructuredDataService);
  readonly key = this.route.snapshot.data['key'] as string;
  readonly title = this.route.snapshot.data['title'] as string;
  constructor() { const path = `/${this.route.snapshot.url.map((item) => item.path).join('/')}`; this.seo.apply({ title: `${this.title} | Kütahya Yerel`, description: `${this.title} hakkında Kütahya Yerel platform bilgileri.`, path, jsonLd: [this.schema.breadcrumbs([{name:'Ana Sayfa',path:'/'},{name:this.title,path}])] }); }
}
