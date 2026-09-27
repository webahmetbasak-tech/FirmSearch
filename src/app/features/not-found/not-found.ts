import { ChangeDetectionStrategy, Component, inject, RESPONSE_INIT } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
@Component({ selector: 'app-not-found', imports: [RouterLink], changeDetection: ChangeDetectionStrategy.OnPush, template: `<section class="page-shell not-found"><p class="eyebrow">404</p><h1>Aradığınız sayfa bulunamadı</h1><p>Adres değişmiş veya içerik kaldırılmış olabilir.</p><a class="button primary" routerLink="/">Ana sayfaya dön</a></section>` })
export class NotFound { private readonly response = inject(RESPONSE_INIT, {optional:true}); private readonly seo = inject(SeoService); constructor() { if (this.response) this.response.status = 404; this.seo.apply({title:'Sayfa Bulunamadı | Kütahya Yerel',description:'Aradığınız sayfa bulunamadı.',path:'/404',robots:'noindex,nofollow'}); } }
