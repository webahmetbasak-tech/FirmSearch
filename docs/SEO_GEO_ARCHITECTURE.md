# SEO, GEO and rendering architecture

## Route silos

```text
/
├── /kutahya/temizlikci
│   ├── /temizlik-firmasi/:slug
│   └── /temizlikci/:slug
└── /kutahya/arac-kiralama
    ├── /arac-kiralama-firmasi/:slug
    └── /kiralik-arac/:slug
```

Cross-silo links live in global navigation and the home page. Entity pages link contextually only inside their own silo.

## Rendering

- Prerender: home, the two canonical vertical landings, and legal/information pages.
- Request SSR: entity routes and catch-all routes, preserving real HTTP 404 behavior for unknown slugs.
- Hydration: official Angular client hydration.
- Critical text, H1, links, metadata and JSON-LD are in SSR/prerendered HTML.

## Index quality gate

An entity is eligible only when `published && indexable && !isDemo` and the build validator passes. A vertical landing is indexable only when it has real inventory. The current published inventory passes this gate and is indexable; non-production records remain excluded from pages and the sitemap.

Future service/intent pages require:

1. distinct user intent;
2. real matching inventory;
3. unique, useful local information;
4. canonical differentiation from the parent landing;
5. no template-only keyword substitution.

## SEO service contract

`SeoService.apply()` centrally manages unique title, description, robots, absolute canonical, Open Graph fields and safely serialized JSON-LD. Query-filtered landing URLs become `noindex,follow`. Aliases are Express HTTP 301 redirects before Angular rendering.

## Answerability / entity clarity

Visible labels explicitly connect city→vertical→company→staff/vehicle. Profiles answer only fields present in data and use “Bilgi verilmedi”, “Henüz değerlendirme yok”, “Fiyat için iletişime geçin”, or “Müsaitlik için iletişime geçin” instead of inference.

## Performance and accessibility

- Browser initial bundle measured by the production build is approximately 314 kB raw / 85 kB estimated transfer.
- No third-party fonts, images, analytics or blocking scripts ship by default.
- Semantic landmarks, visible breadcrumbs, keyboard focus, skip link, 48px controls, responsive layouts and reduced-motion handling are implemented.
- CWV thresholds are targets, not claimed field results. Measure after deployment with CrUX/Search Console and representative devices.

## Security

- WhatsApp numbers remain in server-only config.
- Conversion endpoints accept a known slug only; they never accept a destination URL/phone query parameter.
- E.164 destinations are validated and messages are URI-encoded.
- JSON-LD serialization escapes `<` to prevent script-breakout injection.
- Security headers disable MIME sniffing and unnecessary device permissions.
