import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_CONFIG } from '../config/site.config';

export interface SeoPageConfig {
  title: string;
  description: string;
  path: string;
  robots?: 'index,follow' | 'noindex,follow' | 'noindex,nofollow';
  jsonLd?: readonly Record<string, unknown>[];
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(config: SeoPageConfig): void {
    const canonical = new URL(config.path, SITE_CONFIG.origin).toString();
    const robots = config.robots ?? 'index,follow';
    this.title.setTitle(config.title);
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'robots', content: robots });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'tr_TR' });
    this.setCanonical(canonical);
    this.setJsonLd(config.jsonLd ?? []);
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }

  private setJsonLd(items: readonly Record<string, unknown>[]): void {
    this.document.head.querySelectorAll('script[data-app-jsonld]').forEach((node) => node.remove());
    for (const item of items) {
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-app-jsonld', 'true');
      script.textContent = JSON.stringify(item).replace(/</g, '\\u003c');
      this.document.head.appendChild(script);
    }
  }
}
