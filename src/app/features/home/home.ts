import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketplaceRepository } from '../../core/repositories/marketplace.repository';
import { SeoService } from '../../core/seo/seo.service';
import { StructuredDataService } from '../../core/seo/structured-data.service';

@Component({
  selector: 'app-home', imports: [RouterLink], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero page-shell">
      <p class="eyebrow">KÜTAHYA YEREL PAZARYERİ</p>
      <h1>Kütahya'da hangi hizmeti arıyorsunuz?</h1>
      <p class="lead">Doğrulanabilir işletme, uzman ve araç bilgilerini tek yerde karşılaştırın. İletişime geçmeden önce ayrıntıları açıkça görün.</p>
      <div class="hero-actions"><a class="button primary" routerLink="/kutahya/temizlikci">Temizlikçi bul <span aria-hidden="true">→</span></a><a class="button secondary" routerLink="/kutahya/arac-kiralama">Araç kirala <span aria-hidden="true">→</span></a></div>
    </section>
    <section class="page-shell section" aria-labelledby="categories-title">
      <p class="eyebrow">İKİ AYRI HİZMET ALANI</p><h2 id="categories-title">İhtiyacınıza uygun akışla ilerleyin</h2>
      <div class="sector-grid">
        <article class="sector-card cleaning"><div class="icon" aria-hidden="true">✦</div><p class="kicker">TEMİZLİK HİZMETLERİ</p><h3>Firma ve uzman profillerini inceleyin</h3><p>Hizmet alanı, çalışma kapsamı ve doğrulama durumunu görerek bilgi veya randevu talebi oluşturun.</p><a routerLink="/kutahya/temizlikci">Temizlik seçeneklerine git →</a></article>
        <article class="sector-card rental"><div class="icon" aria-hidden="true">↗</div><p class="kicker">ARAÇ KİRALAMA</p><h3>Firma ve araç ayrıntılarını karşılaştırın</h3><p>Vites, yakıt, kapasite, koşullar ve yalnızca güncel veri varsa fiyat bilgisi üzerinden değerlendirin.</p><a routerLink="/kutahya/arac-kiralama">Araç seçeneklerine git →</a></article>
      </div>
    </section>
    <section class="trust-band"><div class="page-shell"><p class="eyebrow">NASIL ÇALIŞIR?</p><h2>Üç adımda doğrudan iletişim</h2><ol class="steps"><li><span>01</span><div><h3>Alanı seçin</h3><p>Temizlik veya araç kiralama bölümüne ilerleyin.</p></div></li><li><span>02</span><div><h3>Gerçek veriyi inceleyin</h3><p>Yalnızca sağlayıcı tarafından doğrulanabilen alanlar gösterilir.</p></div></li><li><span>03</span><div><h3>Talep oluşturun</h3><p>İlgili sağlayıcıya güvenli, bağlama özel WhatsApp akışıyla ulaşın.</p></div></li></ol></div></section>
    <section class="page-shell section local-note"><div><p class="eyebrow">YEREL VE ŞEFFAF</p><h2>Bilmediğimizi biliyormuş gibi göstermiyoruz.</h2></div><p>Fiyat, müsaitlik, adres, puan veya doğrulama bilgisi mevcut değilse bunu açıkça belirtiyoruz. Yayındaki sağlayıcı profilleri arama motorlarına açık; filtre ve özel iletişim URL’leri indeks dışıdır.</p></section>
  `,
})
export class Home {
  private readonly repository = inject(MarketplaceRepository);
  private readonly seo = inject(SeoService);
  private readonly schema = inject(StructuredDataService);
  constructor() {
    const hasInventory = this.repository.cleaningCompanies().length + this.repository.rentalCompanies().length > 0;
    this.seo.apply({ title: "Kütahya'da Temizlikçi ve Araç Kiralama | Kütahya Yerel", description: "Kütahya'da temizlik hizmeti ve araç kiralama seçeneklerini doğrulanabilir bilgilerle keşfedin.", path: '/', robots: hasInventory ? 'index,follow' : 'noindex,follow', jsonLd: [this.schema.website()] });
  }
}
