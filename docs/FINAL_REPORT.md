# Final implementation report

Date: **2026-09-27**

1. **Official sources:** Angular releases/SSR; Google Search Essentials, JS SEO, canonicals, spam policies, AI features, LocalBusiness, sitemap and vehicle-listing documentation; Schema.org AutoRental/Car; OpenAI, Anthropic and Perplexity crawler documentation; Bing Webmaster, IndexNow and AI Performance. Links and decisions are in `RESEARCH_2026.md`.
2. **Google Ads interpretation:** treated as user-provided 2025-09–2026-08 demand/commercial signals. Unknown geo targeting is disclosed; Ads competition/CPC are not organic difficulty.
3. **Merged intents:** `araç/arac/araba/oto kiralama` and `kiralık araba` share the core rental intent. `temizlikçi/temizlik/temizlik şirketi` share the MVP cleaning discovery route. Price and duration variants are clustered but not published without distinct inventory. Competitor brands are excluded.
4. **SERP result:** cleaning mixes profile directories, price/quote marketplaces and provider sites; rental is dominated by live-inventory aggregators plus local firms. Entity depth, provenance and freshness are the opportunity. Local Pack requires manual localized verification.
5. **Routes:** `/`; `/kutahya/temizlikci`; `/temizlik-firmasi/:slug`; `/temizlikci/:slug`; `/kutahya/arac-kiralama`; `/arac-kiralama-firmasi/:slug`; `/kiralik-arac/:slug`; legal/information pages. Thin intent pages are absent.
6. **Angular:** core, CLI, SSR and build **22.2.0**.
7. **Rendering:** official Angular hybrid rendering. Overview/legal pages and every published entity are prerendered with hydration. The Node build retains request SSR; Vercel serves generated entity HTML and uses functions for contacts and real HTTP 404 responses.
8. **Cleaning:** typed service→company→staff hierarchy, repository abstraction, verification, service/area relationships, company/staff pages and server-only conversion design.
9. **Rental:** typed company→vehicle hierarchy, availability/pricing models, fleet/spec pages and rental-aware structured data.
10. **Add company:** edit `marketplace.data.json` using `DATA_OPERATIONS.md`, then pass validation.
11. **Add staff:** reference a valid cleaning company and service/area IDs; update the company's staff IDs.
12. **Add vehicle:** reference a valid rental company and update its vehicle IDs.
13. **Add price:** positive TRY `daily`, `weekly`, and/or `monthly`, with a visible `updatedAt`. No price means contact-for-price copy and no offer markup.
14. **WhatsApp:** put authorized E.164 digits in server-only `contact.config.ts` keyed by slug, then enable the public boolean. No destination query parameter is accepted.
15. **SEO:** central title/description/robots/canonical/OG/JSON-LD service, crawlable links, breadcrumbs, canonical aliases, inventory quality gates, sitemap validation and real 404s.
16. **GEO/AEO:** answerable visible entity relationships, direct factual labels, no hidden AI content, no special AI schema claim, crawler access split by purpose, and monitoring plan.
17. **Structured data:** WebSite, CollectionPage/ItemList, BreadcrumbList, conditional LocalBusiness/Person/AutoRental/Car and price-gated rental Offer. No rental misuse of Google's for-sale vehicle-listing feature.
18. **Crawler policy:** Googlebot, bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot/User allowed; GPTBot, ClaudeBot and Google-Extended denied by current training-use policy; private conversion routes blocked.
19. **Sitemap:** contains the static pages and all three published, indexable inventory profiles. The generator keeps only canonical production URLs and rewrites their origin when `SITE_ORIGIN` is configured.
20. **Redirects:** server HTTP 301 for cleaning and rental keyword aliases; direct test confirmed `/kutahya/araba-kiralama → /kutahya/arac-kiralama`.
21. **Tests:** data validator, unit tests and SEO/SSR checks cover metadata, H1, canonical, JSON-LD, internal links, redirects, 404s, robots and sitemap.
22. **Build:** production build passed; 10 routes prerendered. Browser initial bundle: 316.23 kB raw, 85.52 kB estimated transfer.
23. **Deployment:** Vercel deploys from GitHub `main`, serves prerendered routes and runs contact/404 functions defined by `vercel.json`. The generated Node server remains available for Docker/VM hosting.
24. **Search Console:** DNS Domain verification, submit sitemap, inspect representative routes/rendered HTML, then monitor indexing, performance and Core Web Vitals.
25. **Bing:** verify/import property, submit sitemap, configure change-only IndexNow, inspect routes and monitor Search Performance + AI Performance.
26. **Still requires real-world validation:** final brand/domain, production host allowlist, legal owner/privacy contacts, real provider authorization and NAP, real photos/reviews/prices/availability, Local Pack and Business Profile review, provider-owned WhatsApp numbers, deployment/CDN bot access, Rich Results/Schema validation on real entities, field CWV and actual search/AI citations.

## Direct production HTTP check

The built server returned 200 for home, both landings, Ayşe Yılmaz, Fatma Duran, Ahmet BAŞAK, robots and sitemap; 404 for unknown staff/vehicle; and 301 for the tested alias. The automated `npm run seo:check` independently repeated these assertions, contact redirects and JSON-LD parsing.
